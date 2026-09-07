import { Router } from "express";
import {
  getEducation,
  getEducationById,
} from "../controllers/educationController.js";
import { protect } from "../middleware/authMiddleware.js";
const r = Router();
r.use(protect);
r.get("/", getEducation);
r.get("/:id", getEducationById);
export default r;
