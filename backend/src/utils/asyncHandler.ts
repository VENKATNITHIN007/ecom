import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Async handler wrapper to eliminate try-catch boilerplate
 * Automatically catches errors and passes them to the error handler middleware
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Type-safe async handler for routes that may not call next()
 */
export const asyncRoute = (
  fn: (req: Request, res: Response) => Promise<Response | void>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};
