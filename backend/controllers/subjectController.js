import Subject from "../models/Subject.js";
import Chapter from "../models/Chapter.js";
import Enrollment from "../models/Enrollment.js";

const decorate = async (subjects, userId) => {
  const ids = subjects.map((s) => s._id);
  const [chapterCounts, enrollments] = await Promise.all([
    Chapter.aggregate([
      { $match: { subject: { $in: ids } } },
      { $group: { _id: "$subject", count: { $sum: 1 } } },
    ]),
    Enrollment.find({ user: userId, subject: { $in: ids } }),
  ]);
  const countMap = new Map(chapterCounts.map((x) => [String(x._id), x.count]));
  const enrollMap = new Map(enrollments.map((x) => [String(x.subject), x]));
  return subjects.map((s) => {
    const e = enrollMap.get(String(s._id));
    const total = countMap.get(String(s._id)) || 0;
    const done = e?.completedChapters.length || 0;
    return {
      ...s.toObject(),
      chapterCount: total,
      enrolled: !!e,
      completedChapters: done,
      progress: total ? Math.round((done / total) * 100) : 0,
    };
  });
};

export const getSubjects = async (req, res, next) => {
  try {
    const q = {};
    if (req.query.education) q.education = req.query.education;
    if (req.query.course) q.course = req.query.course;
    if (req.query.search) q.name = { $regex: req.query.search, $options: "i" };
    const subjects = await Subject.find(q)
      .populate("education")
      .populate("course")
      .sort({ order: 1, name: 1 });
    res.json({ success: true, data: await decorate(subjects, req.user._id) });
  } catch (e) {
    next(e);
  }
};
export const getSubjectsByEducation = (req, res, next) => {
  req.query.education = req.params.educationId;
  return getSubjects(req, res, next);
};
export const getSubjectsByCourse = (req, res, next) => {
  req.query.course = req.params.courseId;
  return getSubjects(req, res, next);
};
export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("education")
      .populate("course");
    if (!subject)
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    const chapters = await Chapter.find({ subject: subject._id })
      .sort({ chapterNumber: 1 })
      .select("-content");
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      subject: subject._id,
    });
    const done = new Set((enrollment?.completedChapters || []).map(String));
    res.json({
      success: true,
      data: {
        ...subject.toObject(),
        chapters: chapters.map((c) => ({
          ...c.toObject(),
          completed: done.has(String(c._id)),
        })),
        enrolled: !!enrollment,
        progress: chapters.length
          ? Math.round((done.size / chapters.length) * 100)
          : 0,
        completedChapters: done.size,
      },
    });
  } catch (e) {
    next(e);
  }
};
