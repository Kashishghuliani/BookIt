import express from "express";
import Slot from "../models/Slot.js";
import Booking from "../models/Booking.js";
import Experience from "../models/Experience.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { slotId, name, email, phone, qty, promoCode } = req.body;
  if (!slotId || !name || !email)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
    if (slot.booked + qty > slot.capacity)
      return res.status(400).json({ success: false, message: "Slot full" });

    const exp = await Experience.findById(slot.experienceId);
    let totalPrice = exp.price * qty + slot.priceDelta;
    if (promoCode === "SAVE10") totalPrice -= totalPrice * 0.1;
    if (promoCode === "FLAT100") totalPrice -= 100;
    if (totalPrice < 0) totalPrice = 0;

    // atomic-like behavior
    slot.booked += qty;
    await slot.save();

    const booking = await Booking.create({
      slotId,
      name,
      email,
      phone,
      qty,
      promoCode,
      totalPrice,
    });

    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
