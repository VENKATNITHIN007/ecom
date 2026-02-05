import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { Photographer } from "../models/photographer.model";
import Booking from "../models/Booking.model";
import { BOOKING_STATUS_TRANSITIONS, ERROR_MESSAGES } from "../constants";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * Create a booking request (user books a photographer)
 */
export const createBooking = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const { photographerId, eventDate, message } = req.body;

    // Check if photographer exists
    const photographer = await Photographer.findById(photographerId);
    if (!photographer) {
      return next(new ApiError(404, ERROR_MESSAGES.PHOTOGRAPHER.NOT_FOUND));
    }

    // Check if user is not booking themselves
    if (photographer.userId.toString() === userId?.toString()) {
      return next(new ApiError(403, ERROR_MESSAGES.BOOKING.CANNOT_BOOK_SELF));
    }

    // Check for existing pending booking on same date
    const existingBooking = await Booking.findOne({
      userId,
      photographerId,
      eventDate: new Date(eventDate),
      status: { $in: ["pending", "accepted"] },
    });

    if (existingBooking) {
      return next(new ApiError(409, ERROR_MESSAGES.BOOKING.EXISTS));
    }

    const booking = await Booking.create({
      photographerId,
      userId,
      eventDate: new Date(eventDate),
      message,
      status: "pending",
    });

    return res
      .status(201)
      .json(new ApiResponse(booking, "Booking request sent successfully"));
  },
);

/**
 * Get my bookings (as a user who booked photographers)
 */
export const getMyBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const bookings = await Booking.find({ userId })
      .populate({
        path: "photographerId",
        select: "username bio location priceFrom",
        populate: { path: "userId", select: "fullName avatar" },
      })
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(bookings, "Bookings fetched successfully"));
  },
);

/**
 * Get booking requests (as a photographer receiving bookings)
 */
export const getBookingRequests = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;

    // Check if user is a photographer
    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return next(new ApiError(403, ERROR_MESSAGES.BOOKING.PHOTOGRAPHER_ONLY));
    }

    const bookings = await Booking.find({ photographerId: photographer._id })
      .populate("userId", "fullName avatar email phoneNumber")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(bookings, "Booking requests fetched successfully"));
  },
);

/**
 * Update booking status (photographer accepts/rejects/completes)
 * Validates status transitions using state machine
 */
export const updateBookingStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const { bookingId } = req.params;
    const { status: newStatus } = req.body;

    // Check if user is a photographer
    const photographer = await Photographer.findOne({ userId });
    if (!photographer) {
      return next(new ApiError(403, ERROR_MESSAGES.BOOKING.PHOTOGRAPHER_ONLY));
    }

    // Find the booking first to validate status transition
    const booking = await Booking.findOne({
      _id: bookingId,
      photographerId: photographer._id,
    });

    if (!booking) {
      return next(new ApiError(404, ERROR_MESSAGES.BOOKING.NOT_FOUND));
    }

    // Validate status transition using state machine
    const currentStatus = booking.status;
    const allowedTransitions = BOOKING_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      return next(
        new ApiError(
          400,
          `${ERROR_MESSAGES.BOOKING.INVALID_TRANSITION} Cannot change from "${currentStatus}" to "${newStatus}". Allowed: ${allowedTransitions.join(", ") || "none"}`,
        ),
      );
    }

    // Update the booking status
    booking.status = newStatus;
    await booking.save();

    return res
      .status(200)
      .json(new ApiResponse(booking, `Booking ${newStatus} successfully`));
  },
);

/**
 * Update booking details (user updates their booking)
 */
export const updateBooking = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const { bookingId } = req.params;
    const { eventDate, message } = req.body;

    // Only allow updating pending bookings
    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
      status: "pending",
    });

    if (!booking) {
      return next(new ApiError(404, ERROR_MESSAGES.BOOKING.CANNOT_MODIFY));
    }

    if (eventDate) booking.eventDate = new Date(eventDate);
    if (message) booking.message = message;

    await booking.save();

    return res
      .status(200)
      .json(new ApiResponse(booking, "Booking updated successfully"));
  },
);

/**
 * Cancel booking (user cancels their booking)
 */
export const cancelBooking = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const { bookingId } = req.params;

    // Only allow canceling pending bookings
    const booking = await Booking.findOneAndDelete({
      _id: bookingId,
      userId,
      status: "pending",
    });

    if (!booking) {
      return next(new ApiError(404, ERROR_MESSAGES.BOOKING.CANNOT_CANCEL));
    }

    return res
      .status(200)
      .json(new ApiResponse({}, "Booking cancelled successfully"));
  },
);

/**
 * Get single booking details
 */
export const getBookingById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const { bookingId } = req.params;

    // Get photographer if user is one
    const photographer = await Photographer.findOne({ userId });

    // Find booking where user is either the customer or the photographer
    const booking = await Booking.findOne({
      _id: bookingId,
      $or: [{ userId }, { photographerId: photographer?._id }],
    })
      .populate("userId", "fullName avatar email phoneNumber")
      .populate({
        path: "photographerId",
        select: "username bio location priceFrom",
        populate: { path: "userId", select: "fullName avatar" },
      });

    if (!booking) {
      return next(new ApiError(404, ERROR_MESSAGES.BOOKING.NOT_FOUND));
    }

    return res
      .status(200)
      .json(new ApiResponse(booking, "Booking fetched successfully"));
  },
);
