import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;

  // identifiers (at least one required)
  email?: string;
  phoneNumber?: string;

  name?: string;
  image?: string;

  // auth metadata
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;

  role?: "user" | "admin";

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true, // allows null + unique
      unique: true,
    },
    phoneNumber: {
      type: String,
      sparse: true,
      unique: true,
    },
    name: String,
    image: String,

    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

/**
 * Ensure at least email OR phone exists
 */
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phoneNumber) {
    next(new Error("Email or phone number is required"));
  } else {
    next();
  }
});

userSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
