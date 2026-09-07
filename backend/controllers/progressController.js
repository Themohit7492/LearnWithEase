import Enrollment from "../models/Enrollment.js";
import Chapter from "../models/Chapter.js";

export const markComplete = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter)
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      subject: chapter.subject,
    });
    if (!enrollment)
      return res
        .status(403)
        .json({
          success: false,
          message: "You must enroll before tracking progress",
        });
    if (
      !enrollment.completedChapters.some(
        (id) => String(id) === String(chapter._id),
      )
    )
      enrollment.completedChapters.push(chapter._id);
    enrollment.lastAccessedChapter = chapter._id;
    await enrollment.save();
    const total = await Chapter.countDocuments({ subject: chapter.subject });
    res.json({
      success: true,
      data: {
        completedCount: enrollment.completedChapters.length,
        totalChapters: total,
        progress: total
          ? Math.round((enrollment.completedChapters.length / total) * 100)
          : 0,
      },
    });
  } catch (e) {
    next(e);
  }
};
export const markAccessed = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter)
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    const e = await Enrollment.findOne({
      user: req.user._id,
      subject: chapter.subject,
    });
    if (!e)
      return res
        .status(403)
        .json({ success: false, message: "Enrollment required" });
    e.lastAccessedChapter = chapter._id;
    await e.save();
    res.json({ success: true, data: { lastAccessedChapter: chapter._id } });
  } catch (e) {
    next(e);
  }
};
export const getOverallProgress = async (req, res, next) => {
  try {
    const es = await Enrollment.find({ user: req.user._id });
    let total = 0,
      done = 0,
      completedSubjects = 0;
    for (const e of es) {
      const count = await Chapter.countDocuments({ subject: e.subject });
      total += count;
      done += e.completedChapters.length;
      if (count > 0 && e.completedChapters.length === count)
        completedSubjects++;
    }
    res.json({
      success: true,
      data: {
        enrolledSubjects: es.length,
        completedChapters: done,
        totalChapters: total,
        overallProgress: total ? Math.round((done / total) * 100) : 0,
        completedSubjects,
      },
    });
  } catch (e) {
    next(e);
  }
};
export const getSubjectProgress = async (req, res, next) => {
  try {
    const e = await Enrollment.findOne({
      user: req.user._id,
      subject: req.params.subjectId,
    });
    if (!e)
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found" });
    const total = await Chapter.countDocuments({
      subject: req.params.subjectId,
    });
    res.json({
      success: true,
      data: {
        completedCount: e.completedChapters.length,
        totalChapters: total,
        progress: total
          ? Math.round((e.completedChapters.length / total) * 100)
          : 0,
      },
    });
  } catch (e) {
    next(e);
  }
};
