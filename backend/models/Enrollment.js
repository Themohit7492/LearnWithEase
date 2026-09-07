import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    completedChapters: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
    ],
    lastAccessedChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
schema.index({ user: 1, subject: 1 }, { unique: true });
export default mongoose.model("Enrollment", schema);
