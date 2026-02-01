import type { Multer } from "multer";
import type { UserType } from "./user";

declare module "express" {
    interface Request {
        user?: UserType;
        file?: Express.Multer.File;
        files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
}