import express from "express";
import { protect } from "../middleware/auth.js";
import Challenge from "../models/Challenge.js";
import UserChallenge from "../models/UserChallenge.js";
import UserStreak from "../models/UserStreak.js";

const router = express.Router();

const todayString = () => new Date().toISOString().split("T")[0];
const yesterdayString = () => new Date(Date.now() - 86400000).toISOString().split("T")[0];

router.get("/today", async (_req, res) => {
  const challenges = await Challenge.find({ challengeDate: todayString() }).sort({ createdAt: 1 });
  return res.json({ challenges });
});

router.get("/me/status", protect, async (req, res) => {
  const [completed, streak] = await Promise.all([
    UserChallenge.find({ user: req.user._id }).select("challenge"),
    UserStreak.findOne({ user: req.user._id }),
  ]);

  return res.json({
    completedChallengeIds: completed.map((item) => item.challenge.toString()),
    streak: streak
      ? {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          totalPoints: streak.totalPoints,
          lastCompletedDate: streak.lastCompletedDate,
        }
      : null,
  });
});

router.post("/:challengeId/complete", protect, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    await UserChallenge.create({
      user: req.user._id,
      challenge: challenge._id,
    });

    const today = todayString();
    const yesterday = yesterdayString();

    let streak = await UserStreak.findOne({ user: req.user._id });
    if (!streak) {
      streak = await UserStreak.create({ user: req.user._id });
    }

    const isConsecutive = streak.lastCompletedDate === yesterday || streak.lastCompletedDate === today;
    const nextCurrent = isConsecutive ? streak.currentStreak + 1 : 1;
    streak.currentStreak = nextCurrent;
    streak.longestStreak = Math.max(streak.longestStreak, nextCurrent);
    streak.totalPoints += challenge.points;
    streak.lastCompletedDate = today;
    await streak.save();

    return res.json({
      message: "Challenge completed",
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        totalPoints: streak.totalPoints,
        lastCompletedDate: streak.lastCompletedDate,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Challenge already completed" });
    }
    return res.status(500).json({ message: "Could not complete challenge" });
  }
});

export default router;
