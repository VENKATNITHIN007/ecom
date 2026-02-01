import { NextFunction, Request, Response } from "express";
import { AUTH_REQUIRED, FORBIDDEN_ACCESS } from "../constants";
import ApiError from "../utils/ApiError";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiError(401, AUTH_REQUIRED));
        }

        const loggedUser = req.user;

        const isAdminUser = loggedUser.role?.toLowerCase() === 'admin';

        if (!isAdminUser) {
            return res.status(403).json(new ApiError(403, FORBIDDEN_ACCESS));
        }

        next();
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
};