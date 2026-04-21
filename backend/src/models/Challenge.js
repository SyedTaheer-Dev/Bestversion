import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "general" },
    points: { type: Number, default: 10 },
    challengeDate: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);
