import { Router } from "express";
import {
  signup,
  login,
  logout,
  me,
  updateLearningProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.patch("/profile/learning", protect, updateLearningProfile);
export default router;
