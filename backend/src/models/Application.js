import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
    status: { type: String, default: "submitted" },
    coverLetter: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

applicationSchema.index({ user: 1, gig: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
