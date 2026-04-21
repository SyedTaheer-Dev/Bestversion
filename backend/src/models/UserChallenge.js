import mongoose from "mongoose";

const userChallengeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userChallengeSchema.index({ user: 1, challenge: 1 }, { unique: true });

export default mongoose.model("UserChallenge", userChallengeSchema);
