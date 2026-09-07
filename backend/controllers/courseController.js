import Course from "../models/Course.js";
export const getCoursesByEducation = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await Course.find({ education: req.params.educationId }).sort({
        name: 1,
      }),
    });
  } catch (e) {
    next(e);
  }
};
export const getCourseById = async (req, res, next) => {
  try {
    const x = await Course.findById(req.params.id).populate("education");
    if (!x)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    res.json({ success: true, data: x });
  } catch (e) {
    next(e);
  }
};
