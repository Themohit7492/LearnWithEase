
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024,
    files: 100,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "text/html",
      "text/css",
      "application/javascript",
      "text/javascript",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "font/woff",
      "font/woff2",
      "font/ttf",
      "application/font-woff",
      "application/font-woff2",
      "application/json",
      "application/octet-stream",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `File type not allowed: ${file.mimetype} (${file.originalname})`
        ),
        false
      );
    }
  },
});

export default upload;

