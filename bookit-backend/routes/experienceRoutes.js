import express from "express";
import Experience from "../models/Experience.js";
import Slot from "../models/Slot.js";

const router = express.Router();

// GET all experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json({ experiences });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET experience details + slots
router.get("/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    const slots = await Slot.find({ experienceId: experience._id });
    res.json({ experience, slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
