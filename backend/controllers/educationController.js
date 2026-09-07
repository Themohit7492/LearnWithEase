import Education from "../models/Education.js";
export const getEducation = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await Education.find().sort({ order: 1, name: 1 }),
    });
  } catch (e) {
    next(e);
  }
};
export const getEducationById = async (req, res, next) => {
  try {
    const x = await Education.findById(req.params.id);
    if (!x)
      return res
        .status(404)
        .json({ success: false, message: "Education not found" });
    res.json({ success: true, data: x });
  } catch (e) {
    next(e);
  }
};
