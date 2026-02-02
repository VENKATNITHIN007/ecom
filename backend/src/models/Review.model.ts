import mongoose, { Schema, model, models } from "mongoose";

export interface IReview {
  _id?: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

const reviewSchema = new Schema<IReview>(
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
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
