import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, default: "" },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
      index: true,
      default: undefined,
    },
    password: { type: String, default: "" },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      index: true,
      default: undefined,
    },
    googleId: { type: String, trim: true, sparse: true, unique: true, default: undefined },
    avatarUrl: { type: String, default: "" },
    authProviders: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    lastLoginAt: { type: Date, default: null },
    lastAuthMethod: {
      type: String,
      enum: ["email", "phone", "google", ""],
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
