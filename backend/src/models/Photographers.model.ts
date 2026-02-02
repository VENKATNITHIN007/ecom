import mongoose, { Schema, model, models } from "mongoose";

export interface IPhotographer {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  slug: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
  profileImage?: string;
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
    slug: { type: String, required: true, unique: true },
    bio: String,
    location: String,
    specialties: [String],
    priceFrom: Number,
    profileImage: String,
  },
  { timestamps: true }
);

const Photographer =
  models.Photographer || model<IPhotographer>("Photographer", photographerSchema);

export default Photographer;
