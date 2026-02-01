import { Request, Response, NextFunction } from "express";
import mongoose, { Model } from "mongoose";
import ApiError from "../utils/ApiError";

type Source = "body" | "query" | "both";

interface ValidationOptions<T extends mongoose.Document> {
    fieldName: string;
    model: Model<T>;
    source?: Source;
}

interface ValidateRequest extends Request {
    query: {
        [fieldName: string]: string | string[] | undefined,
    }
}

export function validateIds<T extends mongoose.Document>({
    fieldName,
    model,
    source = "both",
}: ValidationOptions<T>) {
    return async (req: ValidateRequest, res: Response, next: NextFunction) => {
        let rawIds = source === "body"
            ? req.body[fieldName]
            : source === "query"
                ? req.query[fieldName]
                : req.body[fieldName] ?? req.query[fieldName];

        if (!rawIds) return next();

        const ids = Array.isArray(rawIds) ? rawIds : [rawIds];

        const allValid = ids.every((id) => mongoose.isValidObjectId(id));
        if (!allValid) {
            return res.status(400).json(new ApiError(400, `Invalid ${fieldName} ID(s)`));
        }

        const foundDocs = await model.find({ _id: { $in: ids } });
        if (foundDocs.length !== ids.length) {
            return res.status(404).json(new ApiError(404, `Some ${fieldName} ID(s) not found`));
        }

        if (source === "body" || source === "both") req.body[fieldName] = ids;
        if (source === "query" || source === "both") req.query[fieldName] = ids;

        next();
    };
}
