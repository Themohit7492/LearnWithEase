import { Router } from "express";
import {
  markComplete,
  markAccessed,
  getOverallProgress,
  getSubjectProgress,
} from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";
const r = Router();
r.use(protect);
r.post("/chapter/:chapterId/complete", markComplete);
r.post("/chapter/:chapterId/access", markAccessed);
r.get("/", getOverallProgress);
r.get("/subject/:subjectId", getSubjectProgress);
export default r;
