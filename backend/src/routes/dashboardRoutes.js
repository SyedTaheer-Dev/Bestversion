import express from "express";
import { protect } from "../middleware/auth.js";
import UserStreak from "../models/UserStreak.js";
import Booking from "../models/Booking.js";
import Application from "../models/Application.js";
import UserChallenge from "../models/UserChallenge.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const [user, streak, bookingsCount, applicationsCount, completedChallenges] = await Promise.all([
    User.findById(req.user._id).select("-password"),
    UserStreak.findOne({ user: req.user._id }),
    Booking.countDocuments({ user: req.user._id }),
    Application.countDocuments({ user: req.user._id }),
    UserChallenge.countDocuments({ user: req.user._id }),
  ]);

  return res.json({
    profile: {
      id: user._id.toString(),
      fullName: user.fullName || "",
      email: user.email,
      phone: user.phone || "",
      avatarUrl: user.avatarUrl || "",
    },
    streak: streak
      ? {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          totalPoints: streak.totalPoints,
          lastCompletedDate: streak.lastCompletedDate,
        }
      : null,
    counts: {
      bookings: bookingsCount,
      applications: applicationsCount,
      completedChallenges,
    },
  });
});

router.patch("/profile", protect, async (req, res) => {
  const { fullName = "", phone = "" } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { fullName, phone },
    { new: true }
  ).select("-password");

  return res.json({
    profile: {
      id: updated._id.toString(),
      fullName: updated.fullName || "",
      email: updated.email,
      phone: updated.phone || "",
      avatarUrl: updated.avatarUrl || "",
    },
  });
});

export default router;
