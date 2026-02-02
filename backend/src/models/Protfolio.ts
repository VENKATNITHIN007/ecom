import mongoose, { Schema, model, models } from "mongoose";

export interface IPortfolio {
  _id?: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  mediaUrl: string;
  mediaType: "image" | "video";
  category?: string;
  createdAt?: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    photographerId: {
      type: Schema.Types.ObjectId,
      ref: "Photographer",
      required: true,
    },
    mediaUrl: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    category: String,
  },
  { timestamps: true }
);

const Portfolio =
  models.Portfolio || model<IPortfolio>("Portfolio", portfolioSchema);

export default Portfolio;
