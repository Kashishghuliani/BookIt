import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
});

export default mongoose.model("Experience", experienceSchema);
