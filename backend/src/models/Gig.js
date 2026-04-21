import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, default: "gig" },
    location: { type: String, default: "" },
    salaryRange: { type: String, default: "" },
    deadline: { type: Date, default: null },
    skillsRequired: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Gig", gigSchema);
