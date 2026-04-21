import express from "express";
import { protect } from "../middleware/auth.js";
import Gig from "../models/Gig.js";
import Application from "../models/Application.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const gigs = await Gig.find({ isActive: true }).sort({ createdAt: -1 });
  return res.json({ gigs });
});

router.get("/applications/me", protect, async (req, res) => {
  const applications = await Application.find({ user: req.user._id })
    .populate("gig")
    .sort({ createdAt: -1 });

  return res.json({
    applications: applications.map((item) => ({
      id: item._id.toString(),
      status: item.status,
      coverLetter: item.coverLetter,
      createdAt: item.createdAt,
      gig: item.gig
        ? {
            id: item.gig._id.toString(),
            title: item.gig.title,
            company: item.gig.company,
          }
        : null,
    })),
  });
});

router.post("/applications", protect, async (req, res) => {
  try {
    const { gigId, coverLetter = "" } = req.body;
    if (!gigId) {
      return res.status(400).json({ message: "gigId is required" });
    }

    const application = await Application.create({
      user: req.user._id,
      gig: gigId,
      coverLetter,
    });

    return res.status(201).json({ application });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Already applied to this gig" });
    }
    return res.status(500).json({ message: "Could not submit application" });
  }
});

export default router;
