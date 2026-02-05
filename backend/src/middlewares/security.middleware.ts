import { Request, Response, NextFunction } from "express";

/**
 * Security headers middleware
 * Adds essential security headers to all responses
 */
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS filter
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy (adjust as needed for your frontend)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https: data:; script-src 'self'",
  );

  // Strict Transport Security (HTTPS only in production)
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  next();
};

/**
 * Remove sensitive headers
 */
export const removeSensitiveHeaders = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.removeHeader("X-Powered-By");
  next();
};
