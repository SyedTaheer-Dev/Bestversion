import mongoose from "mongoose";

const authEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    eventType: {
      type: String,
      enum: ["signup", "login", "logout"],
      required: true,
    },
    method: {
      type: String,
      enum: ["email", "phone", "google"],
      required: true,
    },
    email: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    fullName: { type: String, trim: true, default: "" },
    ipAddress: { type: String, trim: true, default: "" },
    userAgent: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

authEventSchema.index({ createdAt: -1 });

export default mongoose.model("AuthEvent", authEventSchema);
