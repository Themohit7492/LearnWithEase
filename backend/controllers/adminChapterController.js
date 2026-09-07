
import mongoose from "mongoose";
import Chapter from "../models/Chapter.js";
import Subject from "../models/Subject.js";
import { uploadToR2 } from "../services/r2Service.js";



const normalizeRelativePath = (value, fallbackName) => {
  if (!value) {
    return fallbackName || "";
  }

  const normalized = String(value)
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^\.\//, "");

  return normalized || fallbackName || "";
};

const uploadFiles = async (
  files,
  basePath,
  relativePaths = []
) => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadedFiles = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const fallbackName = file.originalname || `file-${index}`;
    const relativePath =
      normalizeRelativePath(
        relativePaths[index],
        file.originalRelativePath || fallbackName
      );

    const cleanPath = relativePath
      .split("/")
      .filter(Boolean)
      .join("/");

    const key = cleanPath
      ? `${basePath}/${cleanPath}`
      : `${basePath}/${fallbackName}`;

    let url;

    try {
      url = await uploadToR2(file, key);
    } catch (error) {
      error.message = `Failed to upload ${fallbackName} to R2 at ${key}: ${error.message}`;
      throw error;
    }

    uploadedFiles.push({
      filename: cleanPath || fallbackName,
      key,
      url,
    });
  }

  return uploadedFiles;
};




export const createChapter = async (req, res, next) => {
  try {
    const {
      subjectId,
      title,
      chapterNumber,
      description = "",
    } = req.body;

    

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Chapter title is required",
      });
    }

    if (
      chapterNumber === undefined ||
      chapterNumber === null ||
      chapterNumber === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Chapter number is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }


    

    const subject = await Subject.findById(subjectId)
      .populate("education")
      .populate("course");

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }


    

    const files = req.files || {};

    const explanationFiles =
      files.explanationFiles || [];

    const videoFiles = files.video || [];

    const gameFiles = files.gameFiles || [];

    const quizFiles = files.quizFiles || [];

    const explanationPaths = Array.isArray(
      req.body.explanationFilesPaths
    )
      ? req.body.explanationFilesPaths
      : req.body.explanationFilesPaths
        ? [req.body.explanationFilesPaths]
        : [];

    const gamePaths = Array.isArray(
      req.body.gameFilesPaths
    )
      ? req.body.gameFilesPaths
      : req.body.gameFilesPaths
        ? [req.body.gameFilesPaths]
        : [];

    const quizPaths = Array.isArray(
      req.body.quizFilesPaths
    )
      ? req.body.quizFilesPaths
      : req.body.quizFilesPaths
        ? [req.body.quizFilesPaths]
        : [];


    

    if (videoFiles.length > 1) {
      return res.status(400).json({
        success: false,
        message: "Only one video file is allowed",
      });
    }


    

    const chapterNumberFormatted = String(
      chapterNumber
    ).padStart(3, "0");


    const toPathSegment = (value, fallback) => {
      const segment = String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return segment || fallback;
    };

    const educationSegment = toPathSegment(
      subject.education?.name,
      "education"
    );
    const courseSegment = toPathSegment(
      subject.course?.name,
      "general"
    );
    const subjectSegment = toPathSegment(
      subject.name,
      String(subjectId)
    );

    const chapterFolder =
      `${educationSegment}/${courseSegment}/${subjectSegment}/chapter-${chapterNumberFormatted}`;


    

    const explanationUploaded =
      await uploadFiles(
        explanationFiles,
        `${chapterFolder}/explanation`,
        explanationPaths
      );


    

    let videoUploaded = [];

    if (videoFiles.length > 0) {
      videoUploaded =
        await uploadFiles(
          videoFiles,
          `${chapterFolder}/video`
        );
    }


    

    const gameUploaded =
      await uploadFiles(
        gameFiles,
        `${chapterFolder}/game`,
        gamePaths
      );


    

    const quizUploaded =
      await uploadFiles(
        quizFiles,
        `${chapterFolder}/quiz`,
        quizPaths
      );


    

    const findIndexFile = (files) => {
      return files.find((file) => {
        const filename = file.filename.toLowerCase();
        return filename === "index.html" || filename.endsWith("/index.html");
      });
    };


    const explanationIndex =
      findIndexFile(explanationUploaded);

    const gameIndex =
      findIndexFile(gameUploaded);

    const quizIndex =
      findIndexFile(quizUploaded);


    

    const videoFile =
      videoUploaded.length > 0
        ? videoUploaded[0]
        : null;


    

    const learningContent = {
      explanationUrl:
        explanationIndex?.url || "",

      explanationFiles: explanationUploaded,

      videoUrl:
        videoFile?.url || "",

      videoFiles: videoUploaded,

      gameUrl:
        gameIndex?.url || "",

      gameFiles: gameUploaded,

      quizUrl:
        quizIndex?.url || "",

      quizFiles: quizUploaded,
    };


    

    const chapter =
      await Chapter.findOneAndUpdate(
        {
          subject: new mongoose.Types.ObjectId(
            subjectId
          ),

          chapterNumber: Number(
            chapterNumber
          ),
        },

        {
          subject: new mongoose.Types.ObjectId(
            subjectId
          ),

          title: title.trim(),

          chapterNumber: Number(
            chapterNumber
          ),

          description: description.trim(),

          learningContent,

          
        },

        {
          new: true,

          upsert: true,

          runValidators: true,

          setDefaultsOnInsert: true,
        }
      );


    

    return res.status(201).json({
      success: true,

      message:
        "Chapter uploaded and saved successfully",

      data: {
        chapter,

        uploadedFiles: {
          explanation: explanationUploaded,

          video: videoUploaded,

          game: gameUploaded,

          quiz: quizUploaded,
        },
      },
    });

  } catch (error) {
    console.error(
      "Admin chapter upload error:",
      error
    );

    next(error);
  }
};