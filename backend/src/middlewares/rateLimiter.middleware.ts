import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter
 * For production, use Redis-based rate limiting (e.g., express-rate-limit with redis store)
 */
export const rateLimiter = (
  windowMs: number = 60 * 1000, // 1 minute default
  maxRequests: number = 100,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    if (store[key].count >= maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res
        .status(429)
        .json(
          new ApiError(
            429,
            `Too many requests. Please try again in ${retryAfter} seconds.`,
          ),
        );
    }

    store[key].count++;
    next();
  };
};

/**
 * Stricter rate limiter for auth endpoints
 */
export const authRateLimiter = rateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimiter(60 * 1000, 100); // 100 requests per minute

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60 * 1000);
