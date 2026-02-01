import appConfig from "../config";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { MAX_FILE_SIZE } from "../constants";
import z from "zod";
import ApiError from "./ApiError";
import User from "../models/user.model";
import type { JWT_AUTH } from "../types/user";

/**
 * Create version route
 * @param route 
 * @param version 
 * @returns 
 */
export const createVersionRoute = (route: string, version: number = 1) => "/api/v" + version + "/" + route;

/**
 * Validate files
 * @param acceptedTypes
 * @param label
 * @returns
 */
export const fileValidator = (acceptedTypes: string[], label: string) => {
    return z
        .any()
        .refine((files) => files?.length === 1, {
            message: `${label} is required.`,
        })
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
            message: `${label} must be under 50MB.`,
        })
        .refine((files) => acceptedTypes.includes(files?.[0]?.mimetype), {
            message: `Only ${acceptedTypes.map((type) => "." + type.split("/")[1]).join(", ")} ${label.toLowerCase()} files are allowed.`,
        });
};

/**
 * 
 * @param inputName 
 * @returns 
 */
export function getInitials(inputName: string) {
    const names = inputName.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
}

/**
 * Validates password strength based on comprehensive security criteria
 * @param password - The plain text password to validate
 * @returns Boolean indicating whether the password meets all strength requirements
 * @example
 * // Usage during user registration or password reset
 * if (!isPasswordStrong('Weak1')) {
 *   throw new Error('Password must be at least 8 characters with upper, lower, number, and special character');
 * }
 * @remarks
 * Minimum requirements enforced:
 * - At least 8 characters length
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one digit (0-9)
 * - At least one special character (!@#$%^&*(),.?":{}|<>)
 *
 * Consider adjusting requirements based on your application's security policy
 */
export const isPasswordStrong = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        throw new ApiError(409, "Password length must be 8 characters");
    }

    if (!hasUpperCase) {
        throw new ApiError(409, "Password must have one uppercase letter");
    }

    if (hasLowerCase) {
        throw new ApiError(409, "Password must have one lowercase letter");
    }

    if (hasNumbers) {
        throw new ApiError(409, "Password must have one number");
    }

    if (hasSpecialChar) {
        throw new ApiError(409, "Password must have one Special character");
    }

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar
    );
};

/**
 * Hashes a plain text password using bcrypt with a salt round of 12
 * @async
 * @param password - The plain text password to hash
 * @returns Promise that resolves to the hashed password string
 * @throws {Error} If hashing fails or password is empty
 * @remarks Using salt rounds of 12 provides a good balance between security and performance
 * @example
 * // Usage during user registration or password change
 * const hashedPassword = await hashPassword('newPassword123');
 * // Store hashedPassword in database
 */
export const hashPassword = async function (password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
};

/**
 * Verifies the authenticity and validity of an access token
 * @param token - The JWT access token to verify
 * @returns Decoded token payload if valid, throws error if invalid
 * @throws {Error} If token is expired, malformed, or signature verification fails
 * @example
 * try {
 *   const decoded = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *   console.log(decoded.userId);
 * } catch (error) {
 *   console.error('Invalid token:', error.message);
 * }
 */
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, appConfig.ACCESS_TOKEN_SECRET) as JWT_AUTH;
    } catch (error) {
        console.log("JWT Error", error);

        if (error instanceof TokenExpiredError) {
            throw new ApiError(401, "Token has expired");
        }

        if (error instanceof JsonWebTokenError) {
            throw new ApiError(401, "Invalid Token");
        }

        throw new ApiError(401, "Invalid token");
    }
};

/**
 * Verifies the authenticity and validity of a refresh token
 * @param token - The JWT refresh token to verify
 * @returns Decoded token payload if valid, throws error if invalid
 * @throws {Error} If token is expired, malformed, or signature verification fails
 * @remarks Refresh tokens typically have longer expiration times than access tokens
 * and are used to obtain new access tokens without requiring user re-authentication
 */
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, appConfig.REFRESH_TOKEN_SECRET) as JWT_AUTH;
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new ApiError(401, "Refresh Token has expired");
        }

        if (error instanceof JsonWebTokenError) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        throw new ApiError(401, "Invalid Refresh token");
    }
};

/**
 * Generates new access and refresh tokens
 * @param payload - The payload to include in the tokens (typically user identifier)
 * @returns Object containing both access token and refresh token
 */
export const generateTokens = async (userData: JWT_AUTH) => {
    if (!userData) {
        throw new Error("Data is missing");
    }

    try {
        const accessToken = generateAccessToken(userData);

        const refreshToken = generateRefreshToken(userData);

        /**
         * Update refresh token to database
         */

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await User.findByIdAndUpdate(userData._id, {
            $set: { refreshToken: hashedRefreshToken },
        });

        return { accessToken, refreshToken };
    } catch (error) {
        if (error instanceof Error) {
            throw new ApiError(500, error.message);
        }

        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

/**
 * Generates new access token
 * @param payload - The payload to include in the tokens (typically user identifier)
 * @returns JWT token
 */
export const generateAccessToken = (payload: JWT_AUTH) => {
    return jwt.sign(payload, appConfig.ACCESS_TOKEN_SECRET, {
        expiresIn: appConfig.ACCESS_TOKEN_EXPIRY,
    });
};

/**
 * Generates new refresh token
 * @param payload - The payload to include in the tokens (typically user identifier)
 * @returns JWT token
 */
export const generateRefreshToken = (payload: JWT_AUTH) => {
    return jwt.sign(payload, appConfig.REFRESH_TOKEN_SECRET, {
        expiresIn: appConfig.REFRESH_TOKEN_EXPIRY,
    });
};