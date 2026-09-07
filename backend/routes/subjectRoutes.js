import { Router } from "express";
import {
  getSubjects,
  getSubjectById,
  getSubjectsByEducation,
  getSubjectsByCourse,
} from "../controllers/subjectController.js";
import { protect } from "../middleware/authMiddleware.js";
const r = Router();
r.use(protect);
r.get("/", getSubjects);
r.get("/education/:educationId", getSubjectsByEducation);
r.get("/course/:courseId", getSubjectsByCourse);
r.get("/:id", getSubjectById);
export default r;
