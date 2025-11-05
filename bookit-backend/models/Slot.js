import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: "Experience" },
  date: { type: Date, required: true },
  capacity: { type: Number, required: true },
  booked: { type: Number, default: 0 },
  priceDelta: { type: Number, default: 0 },
});

export default mongoose.model("Slot", slotSchema);
