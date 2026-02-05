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
      index: true,
    },
    mediaUrl: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
      index: true,
    },
    category: { type: String, index: true },
  },
  { timestamps: true },
);

// Index for fetching portfolio items by photographer with category filter
portfolioSchema.index({ photographerId: 1, category: 1 });
portfolioSchema.index({ photographerId: 1, createdAt: -1 });

export const Portfolio = mongoose.model<IPortfolio>(
  "Portfolio",
  portfolioSchema,
);

export default Portfolio;
