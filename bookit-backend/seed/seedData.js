import dotenv from "dotenv";
import mongoose from "mongoose";
import Experience from "../models/Experience.js";
import Slot from "../models/Slot.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "bookit" });
    console.log("📦 Connected to MongoDB!");

    // Clear existing data
    await Experience.deleteMany();
    await Slot.deleteMany();
    console.log("🧹 Cleared old data!");

    // Experience 1 - Hot Air Balloon Ride
    const exp1 = await Experience.create({
      title: "Hot Air Balloon Ride",
      slug: "hot-air-balloon",
      description:
        "Soar above scenic landscapes and enjoy a peaceful sunrise ride in a colorful hot air balloon with stunning panoramic views.",
      price: 2500,
      images: [
        "https://i.pinimg.com/originals/c5/e4/34/c5e4346d859919fca637f9228163d22f.jpg",
      ],
    });

    // Experience 2 - Mountain Trekking Adventure
    const exp2 = await Experience.create({
      title: "Mountain Trekking Adventure",
      slug: "mountain-trek",
      description:
        "Challenge yourself with a thrilling mountain trek surrounded by breathtaking views, wildlife, and crisp fresh air.",
      price: 1800,
      images: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80",
      ],
    });

    // 🆕 Experience 3 - Scuba Diving Experience
    const exp3 = await Experience.create({
      title: "Scuba Diving Experience",
      slug: "scuba-diving",
      description:
        "Dive into the crystal-clear blue waters and explore stunning coral reefs, marine life, and underwater wonders.",
      price: 3200,
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      ],
    });

    // Create future slots (next week & week after)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekAfter = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

    await Slot.insertMany([
      { experienceId: exp1._id, date: nextWeek, capacity: 10 },
      { experienceId: exp1._id, date: weekAfter, capacity: 12 },
      { experienceId: exp2._id, date: nextWeek, capacity: 15 },
      { experienceId: exp2._id, date: weekAfter, capacity: 20 },
      { experienceId: exp3._id, date: nextWeek, capacity: 8 },
      { experienceId: exp3._id, date: weekAfter, capacity: 10 },
    ]);

    console.log("✅ Seed data created successfully!");
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
  } finally {
    process.exit();
  }
};

seed();
