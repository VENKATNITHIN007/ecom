import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import { Photographer, IPhotographer } from "../models/photographer.model";
import { USER_NOT_FOUND } from "../constants";

/** * Create Photographer Profile
 * @param req
 * @param res
 * @returns
 */
export const createPhotographerProfile: RequestHandler = asyncHandler(
  async (req, res) => {
    const { userId, username, bio, location, specialties, priceFrom } =
      req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, USER_NOT_FOUND);
    }
    const existingProfile = await Photographer.findOne({ userId: user._id });
    if (existingProfile) {
      throw new ApiError(
        409,
        "Photographer profile already exists for this user",
      );
    }
    const usernameExists = await Photographer.findOne({
      username: username.toLowerCase(),
    });
    if (usernameExists) {
      throw new ApiError(409, "Username is already taken");
    }
    const photographerData: IPhotographer = {
      userId: user._id,
      username: username.toLowerCase(),
      bio,
      location,
      specialties,
      priceFrom,
    };
    const photographer = await Photographer.create(photographerData);
    return res
      .status(201)
      .json(
        new ApiResponse(
          photographer,
          "Photographer profile created successfully",
        ),
      );
  },
);

/** * Get Photographer Profile by User ID
 * @param req
 * @param res
 * @returns
 */
export const getPhotographerProfileByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    const userId = req.user._id;
    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      throw new ApiError(404, "Photographer profile not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          photographer,
          "Photographer profile fetched successfully",
        ),
      );
  },
);

/** * Get Photographer Profile by Username (Public shareable link)
 * @param req
 * @param res
 * @returns
 */
export const getPhotographerProfileByUsername: RequestHandler = asyncHandler(
  async (req, res) => {
    const { username } = req.params;
    const photographer = await Photographer.findOne({
      username: username.toLowerCase(),
    }).populate("userId", "fullName avatar email");
    if (!photographer) {
      throw new ApiError(404, "Photographer profile not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          photographer,
          "Photographer profile fetched successfully",
        ),
      );
  },
);

/** * Update Photographer Profile
 * @param req
 * @param res
 * @returns
 */
export const updatePhotographerProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    const userId = req.user._id;
    const { bio, location, specialties, priceFrom } = req.body;
    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      throw new ApiError(404, "Photographer profile not found");
    }
    photographer.bio = bio || photographer.bio;
    photographer.location = location || photographer.location;
    photographer.specialties = specialties || photographer.specialties;
    photographer.priceFrom = priceFrom || photographer.priceFrom;
    await photographer.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          photographer,
          "Photographer profile updated successfully",
        ),
      );
  },
);

/**
 * Browse photographers (public) with filters and pagination
 * Supports: location, specialties, priceFrom/priceTo, rating, search
 */

export const browsePhotographers: RequestHandler = asyncHandler(
  async (req, res) => {
    const {
      location,
      specialty,
      minPrice,
      maxPrice,
      minRating,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query as Record<string, string>;

    // parse page from query string, default = "1"
    // base 10 means decimal number system

    // Math.max returns the BIGGEST value among arguments and Math.min returns the SMALLEST value among arguments. This ensures page is NEVER less than 1 and limit is between 1 and 50 to prevent abuse.
  
    const pageNum = Math.max(1, parseInt(page || "1", 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit || "15", 10)));
    const skip = (pageNum - 1) * limitNum;
    const sortByValue = sortBy || "createdAt";
    const sortOrderValue = sortOrder === "asc" ? 1 : -1;

    // Build filter query
    const filter: Record<string, unknown> = {};

    if (location) {
      // Use exact match for controlled input, suitable for indexing
      filter.location = location;
    }

    if (specialty) {
      filter.specialties = { $in: [specialty] };
    }

    if (minPrice || maxPrice) {
      filter.priceFrom = {};
      if (minPrice)
        (filter.priceFrom as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice)
        (filter.priceFrom as Record<string, number>).$lte = Number(maxPrice);
    }

    if (search) {
      // Only search username and location, both controlled and indexable fields
      filter.$or = [
        { username: { $regex: `^${search}`, $options: "i" } },
        { location: { $regex: `^${search}`, $options: "i" } },
      ];
    }

    // Sort options
    const sortOptions: Record<string, 1 | -1> = {
      [sortByValue]: sortOrderValue,
    };

    // Execute query
    const [photographers, totalCount] = await Promise.all([
      Photographer.find(filter)
        .populate("userId", "fullName avatar")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Photographer.countDocuments(filter),
    ]);

    // If minRating filter is provided, we need to filter by average rating
    // This is a more complex operation - for now we return all and filter can be added with aggregation
    let filteredPhotographers = photographers;

    if (minRating) {
      // TODO: Add rating aggregation from reviews collection
      // For now, this is a placeholder - in production, consider denormalizing avg rating
    }

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json(
      new ApiResponse(
        {
          photographers: filteredPhotographers,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalCount,
            perPage: limitNum,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
          },
        },
        "Photographers fetched successfully",
      ),
    );
  },
);
