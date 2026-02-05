import { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { Photographer } from "../models/photographer.model";
import Portfolio, { IPortfolio } from "../models/protfolio.model";

/**
 * Add single portfolio item
 */
export const addPortfolioItem = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    const userId = req.user._id;
    const { mediaUrl, mediaType, category } = req.body;

    // Check if user is a photographer
    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return res
        .status(403)
        .json(new ApiError(403, "Only photographers can add portfolio items"));
    }

    const portfolioItem = await Portfolio.create({
      photographerId: photographer._id,
      mediaUrl,
      mediaType,
      category,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(portfolioItem, "Portfolio item added successfully"),
      );
  } catch (error) {
    console.error("Add Portfolio Item Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while adding portfolio item";
    return res.status(500).json(new ApiError(500, message));
  }
};

/**
 * Add multiple portfolio items (batch upload)
 */
export const addMultiplePortfolioItems = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    const userId = req.user._id;
    const { items } = req.body;

    // Check if user is a photographer
    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return res
        .status(403)
        .json(new ApiError(403, "Only photographers can add portfolio items"));
    }

    // Prepare items with photographerId
    const portfolioItems = items.map((item: IPortfolio) => ({
      photographerId: photographer._id,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      category: item.category,
    }));

    const createdItems = await Portfolio.insertMany(portfolioItems);

    return res
      .status(201)
      .json(
        new ApiResponse(
          createdItems,
          `${createdItems.length} portfolio items added successfully`,
        ),
      );
  } catch (error) {
    console.error("Add Multiple Portfolio Items Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while adding portfolio items";
    return res.status(500).json(new ApiError(500, message));
  }
};

/**
 * Get own portfolio (authenticated photographer)
 */
export const getMyPortfolio = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    const userId = req.user._id;

    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return res
        .status(403)
        .json(new ApiError(403, "Only photographers have portfolios"));
    }

    const portfolio = await Portfolio.find({
      photographerId: photographer._id,
    }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(portfolio, "Portfolio fetched successfully"));
  } catch (error) {
    console.error("Get My Portfolio Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while fetching portfolio";
    return res.status(500).json(new ApiError(500, message));
  }
};

/**
 * Get portfolio by photographer username (public)
 */
export const getPortfolioByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const photographer = await Photographer.findOne({
      username: username.toLowerCase(),
    });
    if (!photographer) {
      return res.status(404).json(new ApiError(404, "Photographer not found"));
    }

    const portfolio = await Portfolio.find({
      photographerId: photographer._id,
    }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(portfolio, "Portfolio fetched successfully"));
  } catch (error) {
    console.error("Get Portfolio by Username Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while fetching portfolio";
    return res.status(500).json(new ApiError(500, message));
  }
};

/**
 * Update portfolio item
 */
export const updatePortfolioItem = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    const userId = req.user._id;
    const { itemId } = req.params;
    const { category } = req.body;

    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return res
        .status(403)
        .json(
          new ApiError(403, "Only photographers can update portfolio items"),
        );
    }

    const portfolioItem = await Portfolio.findOneAndUpdate(
      { _id: itemId, photographerId: photographer._id },
      { category },
      { new: true },
    );

    if (!portfolioItem) {
      return res
        .status(404)
        .json(new ApiError(404, "Portfolio item not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(portfolioItem, "Portfolio item updated successfully"),
      );
  } catch (error) {
    console.error("Update Portfolio Item Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while updating portfolio item";
    return res.status(500).json(new ApiError(500, message));
  }
};

/**
 * Delete single portfolio item
 */
export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    const userId = req.user._id;
    const { itemId } = req.params;

    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return res
        .status(403)
        .json(
          new ApiError(403, "Only photographers can delete portfolio items"),
        );
    }

    const portfolioItem = await Portfolio.findOneAndDelete({
      _id: itemId,
      photographerId: photographer._id,
    });

    if (!portfolioItem) {
      return res
        .status(404)
        .json(new ApiError(404, "Portfolio item not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse({}, "Portfolio item deleted successfully"));
  } catch (error) {
    console.error("Delete Portfolio Item Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while deleting portfolio item";
    return res.status(500).json(new ApiError(500, message));
  }
};

/**
 * Delete multiple portfolio items
 */
export const deleteMultiplePortfolioItems = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    const userId = req.user._id;
    const { itemIds } = req.body;

    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return res
        .status(403)
        .json(
          new ApiError(403, "Only photographers can delete portfolio items"),
        );
    }

    const result = await Portfolio.deleteMany({
      _id: { $in: itemIds },
      photographerId: photographer._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          { deletedCount: result.deletedCount },
          `${result.deletedCount} portfolio items deleted`,
        ),
      );
  } catch (error) {
    console.error("Delete Multiple Portfolio Items Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while deleting portfolio items";
    return res.status(500).json(new ApiError(500, message));
  }
};
