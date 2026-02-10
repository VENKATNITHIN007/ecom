import { Request, RequestHandler, Response } from "express";
import ApiResponse from "../utils/ApiResponse";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import { AUTH_FAILED, AUTH_REQUIRED, USER_EXISTS } from "../constants";
import { generateTokens } from "../utils/helper";
import { clearCookieOptions } from "../config";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * Login user
 * @param req
 * @param res
 * @returns
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email }).select("+password");
  if (!userExists) {
    throw new ApiError(401, AUTH_FAILED);
  }

  if (!userExists.isPasswordCorrect(password)) {
    throw new ApiError(401, AUTH_FAILED);
  }

  const user = {
    _id: userExists._id,
    fullName: userExists.fullName,
    avatar: userExists.avatar,
    role: userExists.role,
  };

  const { accessToken, refreshToken } = await generateTokens(user);
  return res.json(
    new ApiResponse(
      { user, accessToken, refreshToken },
      "You've been logged in successfully!",
    ),
  );
});

/**
 * Register a new User
 * @param req
 * @param res
 * @returns
 */
export const registerUser: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(409, USER_EXISTS);
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  if (user._id) {
    return res
      .status(201)
      .json(new ApiResponse({}, "User has been register successfully!"));
  }

  throw new ApiError(500, "Someting went wrong while registering user");
});

/**
 * Logout User
 * @param req
 * @param res
 * @returns
 */
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, AUTH_REQUIRED);
  }

  const userId = req.user._id;
  const user = await User.findByIdAndUpdate(userId, {
    $set: {
      refreshToken: undefined,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  return res
    .clearCookie("accessToken", clearCookieOptions)
    .clearCookie("refreshToken", clearCookieOptions)
    .json(new ApiResponse({}, "You've logged out successfully!"));
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, AUTH_REQUIRED);
  }
  return res
    .status(200)
    .json(new ApiResponse(req.user, "Fetched current user details"));
});
