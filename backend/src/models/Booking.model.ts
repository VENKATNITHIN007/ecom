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
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventDate: { type: Date, required: true },
    message: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
