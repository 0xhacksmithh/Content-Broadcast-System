import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Multer error: " + err.message,
    });
  }

  // General errors
  if (err) {
    return res.status(400).json({
      message: err.message,
    });
  }

  next();
};
