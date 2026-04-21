import express from "express";
import { protect } from "../middleware/auth.js";
import Mentor from "../models/Mentor.js";
import Booking from "../models/Booking.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const mentors = await Mentor.find({ available: true }).sort({ createdAt: -1 });
  return res.json({ mentors });
});

router.get("/bookings/me", protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("mentor")
    .sort({ bookingDate: -1 });

  return res.json({
    bookings: bookings.map((item) => ({
      id: item._id.toString(),
      bookingDate: item.bookingDate,
      status: item.status,
      notes: item.notes,
      mentor: item.mentor
        ? {
            id: item.mentor._id.toString(),
            name: item.mentor.name,
            title: item.mentor.title,
          }
        : null,
    })),
  });
});

router.post("/bookings", protect, async (req, res) => {
  try {
    const { mentorId, bookingDate, notes = "" } = req.body;
    if (!mentorId || !bookingDate) {
      return res.status(400).json({ message: "mentorId and bookingDate are required" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      mentor: mentorId,
      bookingDate,
      notes,
    });

    return res.status(201).json({ booking });
  } catch (error) {
    return res.status(500).json({ message: "Could not create booking" });
  }
});

export default router;
