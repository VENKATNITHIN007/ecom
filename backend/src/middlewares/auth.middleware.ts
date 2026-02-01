import { NextFunction, Request, Response } from "express";
import { AUTH_FAILED, AUTH_REQUIRED } from "../constants";
import ApiError from "../utils/ApiError";
import User from "../models/user.model";
import { verifyToken } from "../utils/helper";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies.accessToken || req.headers.authorization?.split("Bearer")[1].trim();

        if (!token) {
            throw new ApiError(401, AUTH_REQUIRED)
        }

        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return res.status(401).json(new ApiError(401, AUTH_FAILED));
        }

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json(new ApiError(401, AUTH_FAILED));
        }

        req.user = user;

        next()

    } catch (error) {
        next(error)
    }
}