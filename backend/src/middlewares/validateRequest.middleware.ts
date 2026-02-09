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
            next(error);
        }
    }
}

