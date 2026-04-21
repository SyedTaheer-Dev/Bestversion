import mongoose from "mongoose";

const userStreakSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedDate: { type: String, default: null },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("UserStreak", userStreakSchema);
