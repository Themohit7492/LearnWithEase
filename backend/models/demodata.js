import Chapter from "./Chapter.js";
import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://themohit7492:mohitkumar@cluster0.galek8e.mongodb.net/learnwithease";

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const chapter = await Chapter.create({
      subject: new mongoose.Types.ObjectId("6a9d21b5c01202d4175a69a2"),
      title: "Introduction to DBMS",
      chapterNumber: 1,
      description: "Learn the fundamentals of database management systems.",
      learningContent: {
        explanationUrl:
          "https://pub-beab8506bd664b9b824fc4c40f1d7f0a.r2.dev/btech/cse/dbms/chapter-001/explanation/index.html",
        videoUrl:
          "https://pub-beab8506bd664b9b824fc4c40f1d7f0a.r2.dev/btech/cse/dbms/chapter-001/video/lesson.mp4",
        gameUrl:
          "https://pub-beab8506bd664b9b824fc4c40f1d7f0a.r2.dev/btech/cse/dbms/chapter-001/game/index.html",
        quizUrl:
          "https://pub-beab8506bd664b9b824fc4c40f1d7f0a.r2.dev/btech/cse/dbms/chapter-001/quiz/index.html",
      },
    });

    console.log("Chapter created successfully!");
    console.log("Chapter ID:", chapter._id);
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

main();