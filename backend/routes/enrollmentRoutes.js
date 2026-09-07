import { Router } from "express";
import {
  createEnrollment,
  getEnrollments,
  getEnrollmentBySubject,
} from "../controllers/enrollmentController.js";
import { protect } from "../middleware/authMiddleware.js";
const r = Router();
r.use(protect);
r.post("/", createEnrollment);
r.get("/", getEnrollments);
r.get("/:subjectId", getEnrollmentBySubject);
export default r;
