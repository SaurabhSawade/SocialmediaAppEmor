import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";

export const errorHandler = (
  err: unknown, // ✅ better than Error | ApiError
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error("🔥 Error:", err);

  
  // ✅ Handle custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // ✅ Handle normal JS Error
  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    });
  }

  // ✅ Fallback (unknown error)
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};