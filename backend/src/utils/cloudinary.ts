import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import path from 'path';
import appConfig from "../config";

// Configuration
cloudinary.config({
    cloud_name: appConfig.CLOUDINARY_CLOUD_NAME,
    api_key: appConfig.CLOUDINARY_API_KEY,
    api_secret: appConfig.CLOUDINARY_API_SECRET
});

/**
 * Upload file to cloudinary
 * @param localFilePath 
 * @returns 
 */
export async function uploadToCloudinary(localFilePath: string) {

    if (!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })

        fs.unlinkSync(localFilePath);

        return response.secure_url;

    } catch (error) {
        fs.unlinkSync(localFilePath);

        return null;
    }
}

/**
 * Delete file from cloudinary
 * @param fileUrl 
 * @param fileType 
 * @returns 
 */
export async function deleteFileFromCloudinary(fileUrl: string, fileType: "image" | "raw" | "video" = "image") {

    if (!fileUrl) return null;

    const getFileName = path.parse(fileUrl).name;

    try {
        const response = await cloudinary.api.delete_resources([getFileName], {
            type: 'upload',
            resource_type: fileType,
        })

        return response;

    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw new Error('Failed to delete file from Cloudinary');
    }
}