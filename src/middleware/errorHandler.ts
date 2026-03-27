// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // You can integrate a logging system here

  // If error is an instance of ApiError, use its status code
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Default to 500 Internal Server Error
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};