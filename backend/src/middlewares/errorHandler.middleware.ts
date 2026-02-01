import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

import { ErrorRequestHandler } from "express-serve-static-core"

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toJSON());
    }

    return res.status(err?.statusCode || 500).json(new ApiError(err.statusCode || 500, err.message || "An error occurred", err))
}

export default errorHandler;