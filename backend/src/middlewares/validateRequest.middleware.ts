import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import ApiError from "../utils/ApiError";

export const validateRequest = (schema: ZodType) => {
    return function (req: Request, res: Response, next: NextFunction) {

        try {
            schema.parse({
                ...req.body,
                ...req.files,
                ...req.file,
            })

            next()
        } catch (error) {

            if (error instanceof ZodError) {
                const resError = error.issues.map((e) => e.message);
                return res.status(409).json(new ApiError(409, "Invalid data", resError))
            }

            next(error);
        }
    }
}