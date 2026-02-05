import { Router } from "express";
import {
  createReview,
  getPhotographerReviews,
  getMyReviews,
} from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { CreateReviewSchema } from "../validations/review.validation";

const reviewRouter = Router();

// Public route - Get reviews for a photographer by username
reviewRouter.get("/:username", getPhotographerReviews);

// Protected routes
reviewRouter
  .use(authMiddleware)
  .get("/", getMyReviews)
  .post("/", validateRequest(CreateReviewSchema), createReview);

// Note: Reviews cannot be edited or deleted after submission (per business rules)

export default reviewRouter;
