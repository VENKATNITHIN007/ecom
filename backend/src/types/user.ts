import { Types } from "mongoose";

export interface fileTypes extends Express.Multer.File {
    media: Express.Multer.File[];
    cover: Express.Multer.File[];
}

/**
 * JWT Auth Payload
 */
export type JWT_AUTH = Omit<UserType,"email" | "password" | "refreshToken" | "createdAt" | "updatedAt">;

/**
 * UserType
 */
export type UserType = {
    _id: Types.ObjectId;
    username: string;
    fullName: string;
    email: string;
    password: string;
    avatar?: string;
    refreshToken?: string;
    role: RoleType;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * RoleType
 */
export type RoleType = "user" | "admin";