import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
  name: String,
  email: String,
  phone: String,
  qty: Number,
  promoCode: String,
  totalPrice: Number,
  status: { type: String, default: "CONFIRMED" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
