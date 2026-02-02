import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  _id?: mongoose.Types.ObjectId;

  email?: string;
  phoneNumber?: string;

  fullName: string;
  avatar?: string;

  password: string;
  refreshToken?: string;

  // OTP / verification
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;

  role?: "user" | "admin";

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    avatar: {
      type: String,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordCorrect = async function (password: string,): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
  transform: (_doc, ret:any) => {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.__v;
    return ret;
  },
});


export const User = mongoose.model<IUser>("User", userSchema);

export default User;