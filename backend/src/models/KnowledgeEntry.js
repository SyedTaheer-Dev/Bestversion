import mongoose from "mongoose";

const knowledgeEntrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["general", "support", "personal", "admin", "platform"],
      default: "general",
      index: true,
    },
    keywords: { type: [String], default: [] },
    content: { type: String, required: true, trim: true },
    priority: { type: Number, default: 50 },
    isPublished: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

knowledgeEntrySchema.index({ title: 1 }, { unique: true });

export default mongoose.model("KnowledgeEntry", knowledgeEntrySchema);
