import Enrollment from "../models/Enrollment.js";
import Subject from "../models/Subject.js";
import Chapter from "../models/Chapter.js";

const serialize = async (enrollments) => {
  const subjects = enrollments.map((e) => e.subject?._id).filter(Boolean);
  const counts = await Chapter.aggregate([
    { $match: { subject: { $in: subjects } } },
    { $group: { _id: "$subject", count: { $sum: 1 } } },
  ]);
  const cm = new Map(counts.map((x) => [String(x._id), x.count]));
  return enrollments.map((e) => {
    const total = cm.get(String(e.subject._id)) || 0;
    const done = e.completedChapters.length;
    return {
      ...e.toObject(),
      totalChapters: total,
      completedCount: done,
      progress: total ? Math.round((done / total) * 100) : 0,
    };
  });
};
export const createEnrollment = async (req, res, next) => {
  try {
    const { subjectId } = req.body;
    const subject = await Subject.findById(subjectId);
    if (!subject)
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    const existing = await Enrollment.findOne({
      user: req.user._id,
      subject: subjectId,
    });
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Already enrolled" });
    const first = await Chapter.findOne({ subject: subjectId }).sort({
      chapterNumber: 1,
    });
    const e = await Enrollment.create({
      user: req.user._id,
      subject: subjectId,
      lastAccessedChapter: first?._id || null,
    });
    res.status(201).json({ success: true, data: e });
  } catch (e) {
    next(e);
  }
};
export const getEnrollments = async (req, res, next) => {
  try {
    const rows = await Enrollment.find({ user: req.user._id })
      .populate({ path: "subject", populate: ["education", "course"] })
      .populate("lastAccessedChapter")
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: await serialize(rows) });
  } catch (e) {
    next(e);
  }
};
export const getEnrollmentBySubject = async (req, res, next) => {
  try {
    const e = await Enrollment.findOne({
      user: req.user._id,
      subject: req.params.subjectId,
    })
      .populate("subject")
      .populate("lastAccessedChapter");
    if (!e)
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found" });
    res.json({ success: true, data: (await serialize([e]))[0] });
  } catch (e) {
    next(e);
  }
};
