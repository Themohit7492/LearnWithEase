import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import adminChapterRoutes from "./routes/adminChapterRoutes.js";
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET)
  throw new Error("MONGODB_URI and JWT_SECRET are required");

await connectDB();
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://learnwithease.onrender.com",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "LearnWithEase API is running" }),
);

app.use("/api/auth", authRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminChapterRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LearnWithEase API is running "
  });
});
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
