import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    education: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Education",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
      index: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
schema.index({ name: 1, education: 1, course: 1 }, { unique: true });
export default mongoose.model("Subject", schema);
