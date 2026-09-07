import { Router } from "express";

import {
  getChaptersBySubject,
  getChapterById,
} from "../controllers/chapterController.js";

import { protect } from "../middleware/authMiddleware.js";

const r = Router();

r.use(protect);

r.get("/subject/:subjectId", getChaptersBySubject);
r.get("/:id", getChapterById);

export default r;

