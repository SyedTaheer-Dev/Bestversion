import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    expertise: { type: [String], default: [] },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    hourlyRate: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Mentor", mentorSchema);
