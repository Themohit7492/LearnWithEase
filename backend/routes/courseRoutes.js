import { Router } from "express";
import {
  getCoursesByEducation,
  getCourseById,
} from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";
const r = Router();
r.use(protect);
r.get("/education/:educationId", getCoursesByEducation);
r.get("/by-education/:educationId", getCoursesByEducation);
r.get("/:id", getCourseById);
export default r;
