import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
    bookingDate: { type: Date, required: true },
    status: { type: String, default: "pending" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
