import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, default: "" },
    education: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Education",
      required: true,
      index: true,
    },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);
schema.index({ name: 1, education: 1 }, { unique: true });
export default mongoose.model("Course", schema);
