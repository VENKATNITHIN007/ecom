import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { Photographer } from "../models/photographer.model";
import Review from "../models/Review.model";
import Booking from "../models/Booking.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ERROR_MESSAGES } from "../constants";

/**
 * Create a review for a photographer
 */
export const createReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const { photographerId, rating, comment } = req.body;

    // Check if photographer exists
    const photographer = await Photographer.findById(photographerId);
    if (!photographer) {
      return next(new ApiError(404, ERROR_MESSAGES.PHOTOGRAPHER.NOT_FOUND));
    }

    // Check if user is not reviewing themselves
    if (photographer.userId.toString() === userId?.toString()) {
      return next(new ApiError(403, ERROR_MESSAGES.REVIEW.CANNOT_REVIEW_SELF));
    }

    // Check if user has a completed booking with this photographer
    const completedBooking = await Booking.findOne({
      userId,
      photographerId,
      status: "completed",
    });

    if (!completedBooking) {
      return next(new ApiError(403, ERROR_MESSAGES.REVIEW.REQUIRES_BOOKING));
    }

    // Check if user already reviewed this photographer
    const existingReview = await Review.findOne({ userId, photographerId });
    if (existingReview) {
      return next(new ApiError(409, ERROR_MESSAGES.REVIEW.EXISTS));
    }

    const review = await Review.create({
      photographerId,
      userId,
      rating,
      comment,
    });

    return res
      .status(201)
      .json(new ApiResponse(review, "Review submitted successfully"));
  },
);

/**
 * Get reviews for a photographer (public)
 */
export const getPhotographerReviews = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    const photographer = await Photographer.findOne({
      username: username.toLowerCase(),
    });
    if (!photographer) {
      return next(new ApiError(404, ERROR_MESSAGES.PHOTOGRAPHER.NOT_FOUND));
    }

    const reviews = await Review.find({ photographerId: photographer._id })
      .populate("userId", "fullName avatar")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating =
      reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    return res.status(200).json(
      new ApiResponse(
        {
          reviews,
          averageRating: Number(averageRating),
          totalReviews: reviews.length,
        },
        "Reviews fetched successfully",
      ),
    );
  },
);

/**
 * Get my reviews (reviews I've written)
 */
export const getMyReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const reviews = await Review.find({ userId })
      .populate("photographerId", "username")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(reviews, "My reviews fetched successfully"));
  },
);
