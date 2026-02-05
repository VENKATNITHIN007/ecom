import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getBookingRequests,
  updateBookingStatus,
  updateBooking,
  cancelBooking,
  getBookingById,
} from "../controllers/booking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  CreateBookingSchema,
  UpdateBookingStatusSchema,
  UpdateBookingSchema,
} from "../validations/booking.validation";

const bookingRouter = Router();

// All booking routes require authentication
bookingRouter.use(authMiddleware);

// User routes
bookingRouter.post("/", validateRequest(CreateBookingSchema), createBooking);
bookingRouter.get("/my-bookings", getMyBookings);
bookingRouter.get("/:bookingId", getBookingById);
bookingRouter.patch(
  "/:bookingId",
  validateRequest(UpdateBookingSchema),
  updateBooking,
);
bookingRouter.delete("/:bookingId", cancelBooking);

// Photographer routes
bookingRouter.get("/requests/all", getBookingRequests);
bookingRouter.patch(
  "/:bookingId/status",
  validateRequest(UpdateBookingStatusSchema),
  updateBookingStatus,
);

export default bookingRouter;
