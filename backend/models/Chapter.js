
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    chapterNumber: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },


    learningContent: {
      explanationUrl: {
        type: String,
        default: "",
      },

      explanationFiles: {
        type: [
          {
            filename: String,
            key: String,
            url: String,
          },
        ],
        default: [],
      },

      videoUrl: {
        type: String,
        default: "",
      },

      videoFiles: {
        type: [
          {
            filename: String,
            key: String,
            url: String,
          },
        ],
        default: [],
      },

      gameUrl: {
        type: String,
        default: "",
      },

      gameFiles: {
        type: [
          {
            filename: String,
            key: String,
            url: String,
          },
        ],
        default: [],
      },

      quizUrl: {
        type: String,
        default: "",
      },

      quizFiles: {
        type: [
          {
            filename: String,
            key: String,
            url: String,
          },
        ],
        default: [],
      },
    },
  },
  { timestamps: true }
);

schema.index(
  { subject: 1, chapterNumber: 1 },
  { unique: true }
);

export default mongoose.model("Chapter", schema);

