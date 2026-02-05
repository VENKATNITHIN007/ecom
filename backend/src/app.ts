import express from "express";
import cors from "cors";
import { createVersionRoute } from "./utils/helper";
import errorHandler from "./middlewares/errorHandler.middleware";
import ApiError from "./utils/ApiError";
import connectToDB from "./db";
import userRouter from "./routes/user.router";
import cookieParser from "cookie-parser";
import photographerRouter from "./routes/photographer.route";
import portfolioRouter from "./routes/portfolio.route";
import reviewRouter from "./routes/review.route";
import bookingRouter from "./routes/booking.route";
import {
  securityHeaders,
  removeSensitiveHeaders,
} from "./middlewares/security.middleware";
import { apiRateLimiter } from "./middlewares/rateLimiter.middleware";

const allowedHost = process.env.ORIGIN_HOSTS
  ? process.env.ORIGIN_HOSTS.split(",").map((h) => h.trim())
  : "*";

const port = process.env.PORT || 3001;

const app = express();

/**
 * Security middlewares (apply early in the chain)
 */
app.use(securityHeaders);
app.use(removeSensitiveHeaders);

app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ limit: "10MB", extended: true }));
app.use(cookieParser());

/**
 * Cors
 */
app.use(
  cors({
    origin: allowedHost,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

/**
 * Rate limiting for API routes
 */
app.use("/api", apiRateLimiter);

/**
 * Routing
 */

app.use(createVersionRoute("users"), userRouter);
app.use(createVersionRoute("photographers"), photographerRouter);
app.use(createVersionRoute("portfolio"), portfolioRouter);
app.use(createVersionRoute("reviews"), reviewRouter);
app.use(createVersionRoute("bookings"), bookingRouter);

/**
 * Error Handing
 */
app.use(errorHandler);

/**
 * 404 errors
 */
app.use("*", function (req, res) {
  return res.status(404).json(new ApiError(404, "Page not found"));
});

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.info(
        `Dukan backend is running on http://localhost:${port} in ${app.settings.env} mode`,
      );
    });
  })
  .catch((err) => console.error(err));
