import type { Multer } from "multer";
import type { UserType } from "./user";
import type { IPhotographer } from "../models/photographer.model";

declare module "express" {
  interface Request {
    user?: UserType;
    photographer?: IPhotographer & { _id: import("mongoose").Types.ObjectId };
    file?: Express.Multer.File;
    files?:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] };
  }
}
