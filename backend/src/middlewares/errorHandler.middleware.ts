import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { ErrorRequestHandler } from "express-serve-static-core";
import { ZodError } from "zod";
import mongoose from "mongoose";

/**
 * Global error handler middleware
 * Handles different error types and returns consistent error responses
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Handle ApiError (our custom error class)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res
      .status(400)
      .json(new ApiError(400, "Validation failed", formattedErrors).toJSON());
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const formattedErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res
      .status(400)
      .json(new ApiError(400, "Validation failed", formattedErrors).toJSON());
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return res
      .status(400)
      .json(new ApiError(400, `Invalid ${err.path}: ${err.value}`).toJSON());
  }

  // Handle MongoDB duplicate key errors
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: number }).code === 11000
  ) {
    const mongoErr = err as { keyValue?: Record<string, unknown> };
    const field = Object.keys(mongoErr.keyValue || {})[0] || "field";
    return res
      .status(409)
      .json(new ApiError(409, `Duplicate value for ${field}`).toJSON());
  }

  // Handle generic errors
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";
  const stack = err instanceof Error ? err.stack : undefined;

  console.error("Unhandled Error:", err);

  return res
    .status(500)
    .json(new ApiError(500, message, undefined, stack).toJSON());
};

export default errorHandler;
