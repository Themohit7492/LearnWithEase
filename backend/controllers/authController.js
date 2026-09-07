import User from "../models/User.js";
import Education from "../models/Education.js";
import Course from "../models/Course.js";
import { createToken, setAuthCookie } from "../utils/token.js";
import { isAdminEmail } from "../utils/admin.js";

const isProduction =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const serializeUser = (user) => ({
  ...user.toJSON(),
  isAdmin: isAdminEmail(user.email),
});

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, email and password are required",
        });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address" });
    if (password.length < 6)
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });
    if (await User.exists({ email: normalizeEmail(email) }))
      return res
        .status(409)
        .json({
          success: false,
          message: "An account with this email already exists",
        });
    const user = await User.create({
      name: name.trim(),
      email: normalizeEmail(email),
      password,
    });
    setAuthCookie(res, createToken(user._id));
    res.status(201).json({ success: true, data: serializeUser(user) });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    const user = await User.findOne({ email: normalizeEmail(email) });
    if (!user || !(await user.comparePassword(password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    setAuthCookie(res, createToken(user._id));
    res.json({ success: true, data: serializeUser(user) });
  } catch (e) {
    next(e);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.json({ success: true, message: "Logged out" });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("education")
    .populate("course");
  res.json({
    success: true,
    data: { ...user.toJSON(), isAdmin: isAdminEmail(user.email) },
  });
};

export const updateLearningProfile = async (req, res, next) => {
  try {
    const { educationId, courseId = null } = req.body;
    const education = await Education.findById(educationId);
    if (!education)
      return res
        .status(404)
        .json({ success: false, message: "Education not found" });
    let course = null;
    if (education.requiresCourse) {
      course = await Course.findOne({ _id: courseId, education: educationId });
      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "A valid course is required" });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { education: educationId, course: course?._id || null },
      { new: true },
    )
      .select("-password")
      .populate("education")
      .populate("course");
    res.json({
      success: true,
      data: { ...user.toJSON(), isAdmin: isAdminEmail(user.email) },
    });
  } catch (e) {
    next(e);
  }
};
