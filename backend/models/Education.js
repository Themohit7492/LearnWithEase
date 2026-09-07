import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    requiresCourse: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export default mongoose.model("Education", schema);
