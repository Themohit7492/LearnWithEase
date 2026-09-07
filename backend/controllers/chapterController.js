
import mongoose from "mongoose";
import Chapter from "../models/Chapter.js";
import Enrollment from "../models/Enrollment.js";

export const getChaptersBySubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    const chapters = await Chapter.find({
      subject: subjectId,
    })
      .sort({ chapterNumber: 1 })
      .select("_id subject title chapterNumber description learningContent")
      .lean();

    return res.status(200).json({
      success: true,
      data: chapters,
    });
  } catch (e) {
    next(e);
  }
};

export const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const chapter = await Chapter.findById(id)
      .populate({
        path: "subject",
        populate: [
          {
            path: "education",
          },
          {
            path: "course",
          },
        ],
      })
      .lean();

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    if (!chapter.subject) {
      return res.status(404).json({
        success: false,
        message: "Subject for this chapter was not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      subject: chapter.subject._id,
    }).lean();

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "Enroll in this subject before opening chapters",
      });
    }

    const siblings = await Chapter.find({
      subject: chapter.subject._id,
    })
      .sort({ chapterNumber: 1 })
      .select("_id title chapterNumber")
      .lean();

    const currentIndex = siblings.findIndex(
      (x) => String(x._id) === String(chapter._id)
    );

    const previous = currentIndex > 0 ? siblings[currentIndex - 1] : null;
    const next =
      currentIndex !== -1 && currentIndex < siblings.length - 1
        ? siblings[currentIndex + 1]
        : null;

    const completed =
      enrollment.completedChapters?.some(
        (chapterId) => String(chapterId) === String(chapter._id)
      ) || false;

    const learningContent = {
      explanationUrl: chapter.learningContent?.explanationUrl || "",
      explanationFiles: chapter.learningContent?.explanationFiles || [],
      videoUrl: chapter.learningContent?.videoUrl || "",
      videoFiles: chapter.learningContent?.videoFiles || [],
      gameUrl: chapter.learningContent?.gameUrl || "",
      gameFiles: chapter.learningContent?.gameFiles || [],
      quizUrl: chapter.learningContent?.quizUrl || "",
      quizFiles: chapter.learningContent?.quizFiles || [],
    };

    return res.status(200).json({
      success: true,
      data: {
        _id: chapter._id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        description: chapter.description || "",
        content: chapter.content || "",
        learningContent,
        subject: chapter.subject,
        completed,
        enrolled: true,
        previous,
        next,
        totalChapters: siblings.length,
      },
    });
  } catch (e) {
    next(e);
  }
};

