import { Request, RequestHandler, Response } from "express";
import ApiResponse from "../utils/ApiResponse";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import { AUTH_FAILED, AUTH_REQUIRED, USER_EXISTS } from "../constants";
import { generateTokens } from "../utils/helper";
import { clearCookieOptions } from "../config";

/**
 * Login user
 * @param req 
 * @param res 
 * @returns 
 */
export const loginUser = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        const userExists = await User.findOne({ email }).select("+password")

        if (!userExists) {
            return res.status(401).json(new ApiError(401, AUTH_FAILED))
        }

        if (!userExists.isPasswordCorrect(password)) {
            return res.status(401).json(new ApiError(401, AUTH_FAILED))
        }

        const user = {
            _id: userExists._id,
            username: userExists.username,
            fullName: userExists.fullName,
            avatar: userExists.avatar,
            role: userExists.role,
        }

        const { accessToken, refreshToken } = await generateTokens(user);

        return res.json(new ApiResponse({ user, accessToken, refreshToken }, "You've been logged in successfully!"))
    } catch (error) {

        console.error("Login user Error:", error);

        const message =
            error instanceof Error
                ? error.message || "Something went wrong while logging user"
                : "Something went wrong while logging user";

        return res.status(500).json(new ApiError(500, message));
    }
}

/**
 * Register a new User
 * @param req 
 * @param res 
 * @returns 
 */
export const registerUser: RequestHandler = async (req, res) => {
    try {
        const { email, password, username, fullName } = req.body;

        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (userExists) {
            return res.status(401).json(new ApiError(409, USER_EXISTS))
        }

        /**
         * Create a new User
         */
        const user = await User.create({
            username,
            fullName,
            email,
            password
        });

        if (!user._id) {
            return res.status(201).json(new ApiResponse({}, "User has been register successfully!"))
        }


        return res.status(500).json(new ApiError(500, "Someting went wrong while registering user"))

    } catch (error) {
        console.error("Register user Error:", error);

        const message =
            error instanceof Error
                ? error.message || "Something went wrong while registering a new user"
                : "Something went wrong while registering a new user";

        return res.status(500).json(new ApiError(500, message));
    }
}


/**
 * Logout User
 * @param req
 * @param res
 * @returns
 */
export const logoutUser = async (req: Request, res: Response) => {
    try {

        if (!req.user) {
            return res.status(401).json(new ApiError(401, AUTH_REQUIRED))
        }

        const userId = req.user._id;

        const user = await User.findByIdAndUpdate(userId, {
            $set: {
                refreshToken: undefined,
            },
        });

        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found!"))
        }

        return res
            .clearCookie("accessToken", clearCookieOptions)
            .clearCookie("refreshToken", clearCookieOptions)
            .json(new ApiResponse({}, "You've logged out successfully!"))
    } catch (error) {
        console.error("Logout user Error:", error);

        const message =
            error instanceof Error
                ? error.message || "Something went wrong while logout a User"
                : "Something went wrong while logout a User";

        return res.status(500).json(new ApiError(500, message));
    }
};


export const currentUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiError(401, AUTH_REQUIRED));
        }

        return res.json(new ApiResponse(req.user, "Fetched current user details"));
    } catch (error) {
        console.error("Current user fetch Error:", error);

        const message =
            error instanceof Error
                ? error.message || "Something went wrong while fetching current user details"
                : "Something went wrong while fetching current user details";

        return res.status(500).json(new ApiError(500, message));       
    }
}