export const notFound = (req, res) =>
  res
    .status(404)
    .json({ success: false, message: `Route not found: ${req.originalUrl}` });

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.name === "CastError")
    return res
      .status(400)
      .json({ success: false, message: "Invalid resource id" });
  if (err.code === 11000)
    return res
      .status(409)
      .json({ success: false, message: "Duplicate record" });
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server error" });
};
