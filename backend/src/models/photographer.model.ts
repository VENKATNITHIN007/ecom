import mongoose, { Schema, model, models } from "mongoose";

export interface IPhotographer {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const photographerSchema = new Schema<IPhotographer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores",
      ],
    },
    bio: String,
    location: { type: String, index: true },
    specialties: [{ type: String, index: true }],
    priceFrom: { type: Number, index: true },
  },
  { timestamps: true },
);

// Text index for search functionality
photographerSchema.index({ username: "text", bio: "text", location: "text" });
// Compound index for browse with filters
photographerSchema.index({ location: 1, priceFrom: 1 });
photographerSchema.index({ specialties: 1, priceFrom: 1 });

export const Photographer = mongoose.model<IPhotographer>(
  "Photographer",
  photographerSchema,
);

export default Photographer;
