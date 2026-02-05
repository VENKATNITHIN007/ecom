import { Request, RequestHandler, Response } from "express";
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
export const createPhotographerProfile: RequestHandler = async (req, res) => {
  try {
    const { userId, username, bio, location, specialties, priceFrom } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, USER_NOT_FOUND));
    }

    const existingProfile = await Photographer.findOne({ userId: user._id });
    if (existingProfile) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            "Photographer profile already exists for this user",
          ),
        );
    }

    // check if username is already taken
    const usernameExists = await Photographer.findOne({
      username: username.toLowerCase(),
    });
    if (usernameExists) {
      return res
        .status(409)
        .json(new ApiError(409, "Username is already taken"));
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
  } catch (error) {
    console.error("Create Photographer Profile Error:", error);
    const message =
      error instanceof Error
        ? error.message ||
          "Something went wrong while creating photographer profile"
        : "Something went wrong while creating photographer profile";
    return res.status(500).json(new ApiError(500, message));
  }
};
/** * Get Photographer Profile by User ID
 * @param req
 * @param res
 * @returns
 */
export const getPhotographerProfileByUserId = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }
    const userId = req.user._id;

    // find photographer profile by userId
    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return res
        .status(404)
        .json(new ApiError(404, "Photographer profile not found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          photographer,
          "Photographer profile fetched successfully",
        ),
      );
  } catch (error) {
    console.error("Get Photographer Profile Error:", error);
    const message =
      error instanceof Error
        ? error.message ||
          "Something went wrong while fetching photographer profile"
        : "Something went wrong while fetching photographer profile";
    return res.status(500).json(new ApiError(500, message));
  }
};

/** * Get Photographer Profile by Username (Public shareable link)
 * @param req
 * @param res
 * @returns
 */
export const getPhotographerProfileByUsername: RequestHandler = async (
  req,
  res,
) => {
  try {
    const { username } = req.params;
    // find photographer profile by username
    const photographer = await Photographer.findOne({
      username: username.toLowerCase(),
    }).populate("userId", "fullName avatar email");
    if (!photographer) {
      return res
        .status(404)
        .json(new ApiError(404, "Photographer profile not found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          photographer,
          "Photographer profile fetched successfully",
        ),
      );
  } catch (error) {
    console.error("Get Photographer Profile by Username Error:", error);
    const message =
      error instanceof Error
        ? error.message ||
          "Something went wrong while fetching photographer profile by username"
        : "Something went wrong while fetching photographer profile by username";
    return res.status(500).json(new ApiError(500, message));
  }
};

/** * Update Photographer Profile
 * @param req
 * @param res
 * @returns
 */
export const updatePhotographerProfile = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }
    const userId = req.user._id;
    const { bio, location, specialties, priceFrom } = req.body;

    // find photographer profile by userId
    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return res
        .status(404)
        .json(new ApiError(404, "Photographer profile not found"));
    }
    // update photographer profile
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
  } catch (error) {
    console.error("Update Photographer Profile Error:", error);
    const message =
      error instanceof Error
        ? error.message ||
          "Something went wrong while updating photographer profile"
        : "Something went wrong while updating photographer profile";
    return res.status(500).json(new ApiError(500, message));
  }
};

/**
 * Browse photographers (public) with filters and pagination
 * Supports: location, specialties, priceFrom/priceTo, rating, search
 */
export const browsePhotographers: RequestHandler = async (req, res) => {
  try {
    const {
      location,
      specialty,
      minPrice,
      maxPrice,
      minRating,
      search,
      page = "1",
      limit = "15",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter query
    const filter: Record<string, unknown> = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
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
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions: Record<string, 1 | -1> = {
      [sortBy as string]: sortOrder === "asc" ? 1 : -1,
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
  } catch (error) {
    console.error("Browse Photographers Error:", error);
    const message =
      error instanceof Error
        ? error.message || "Something went wrong while browsing photographers"
        : "Something went wrong while browsing photographers";
    return res.status(500).json(new ApiError(500, message));
  }
};
