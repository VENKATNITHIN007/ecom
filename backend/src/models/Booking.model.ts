import mongoose, { Schema, model, models } from "mongoose";

export interface IBooking {
  _id?: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  eventDate: Date;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    photographerId: {
      type: Schema.Types.ObjectId,
      ref: "Photographer",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventDate: { type: Date, required: true, index: true },
    message: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

// Compound indexes for common queries
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ photographerId: 1, status: 1 });
bookingSchema.index({ userId: 1, photographerId: 1, eventDate: 1 });
bookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
