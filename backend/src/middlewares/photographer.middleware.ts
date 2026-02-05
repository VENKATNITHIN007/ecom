import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { Photographer } from "../models/photographer.model";

/**
 * Middleware to check if the current user is a photographer
 * Attaches photographer document to req.photographer
 */
export const isPhotographer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    const photographer = await Photographer.findOne({ userId: req.user._id });

    if (!photographer) {
      return res
        .status(403)
        .json(new ApiError(403, "Only photographers can access this resource"));
    }

    // Attach photographer to request for use in controllers
    req.photographer = photographer;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional photographer check - attaches photographer if exists, but doesn't block
 */
export const attachPhotographer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user) {
      const photographer = await Photographer.findOne({ userId: req.user._id });
      if (photographer) {
        req.photographer = photographer;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
