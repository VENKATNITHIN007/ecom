import "dotenv/config"

export const appConfig = {
    debug: process.env.NODE_ENV !== "production" || String(process.env.APP_DEBUG).toLowerCase() === "true",

    // Access Token
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1d",

    // Refresh Token
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",

    // Database
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

    // MongoDB Database
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",

    DB_NAME: process.env.DB_NAME || "dukan"
}

export const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
}

export const accessTokenCookieOptions = {
    ...clearCookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
};

export const refreshTokenCookieOptions = {
    ...clearCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export default appConfig;