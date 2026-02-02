import mongoose, { Model, Schema } from "mongoose";
import { UserType } from "../types/user";
import bcrypt from "bcrypt";

type userModel = Model<UserType>;

type UserMethods = {
    isPasswordCorrect: (password: string) => Promise<boolean>;
};

const userSchema = new Schema<UserType, userModel, UserMethods>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            lowercase: true,
            unique: true,
            index: true,
            trim: true,
            minLength: [3, "Username must be at least 3 characters long"],
            maxLength: [30, "Username cannot exceed 30 characters"],
            match: [
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores",
            ],
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minLength: [2, "Full name must be at least 2 characters long"],
            maxLength: [50, "Full name cannot exceed 50 characters"],
            match: [
                /^[a-zA-Z\s]+$/,
                "Full name can only contain letters and spaces",
            ],
        },
        email: {
            type: String,
            required: [true, "Email address is required"],
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address",
            ],
        },
        password: {
            type: String,
            select: false,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters long"],
            maxLength: [70, "Password cannot exceed 70 characters"],
            // validate: {
            //     validator: function (password: string) {
            //         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
            //             password,
            //         );
            //     },
            //     message:
            //         "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            // },
        },
        refreshToken: {
            type: String,
            trim: true,
            select: false,
        },
        avatar: {
            type: String,
            trim: true,
            default: null,
            validate: {
                validator: function (url: string) {
                    if (!url) return true;
                    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url);
                },
                message: "Please provide a valid URL for the avatar",
            },
        },
        role: {
            type: String,
            enum: {
                values: ["user", "admin"],
                message: "Role must be either user or admin",
            },
            default: "user",
        }
    },
    {
        timestamps: true,
    },
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
    transform: (doc, ret) => {
        const { password, refreshToken, __v, ...rest } = ret;
        return rest;
    },
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    return user;
};

export const User = mongoose.model("User", userSchema);

export default User;