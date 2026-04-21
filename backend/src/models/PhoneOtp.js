import mongoose from "mongoose";

const phoneOtpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, trim: true, index: true },
    codeHash: { type: String, required: true },
    fullName: { type: String, trim: true, default: "" },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export default mongoose.model("PhoneOtp", phoneOtpSchema);
