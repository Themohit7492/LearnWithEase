import { isAdminEmail } from "../utils/admin.js";

export const requireAdmin = (req, res, next) => {
  if (!req.user || !isAdminEmail(req.user.email)) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};