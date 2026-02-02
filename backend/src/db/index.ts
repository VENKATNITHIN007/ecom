import mongoose from "mongoose";
import appConfig from "../config";
import ApiError from "../utils/ApiError";

export default async function connectToDB() {
  const { MONGO_URL, DB_NAME } = appConfig;

  if (!MONGO_URL || !DB_NAME) {
    console.error("❌ Missing MongoDB configuration (MONGO_URL or DB_NAME).");

    throw new ApiError(
      500,
      "❌ Missing MongoDB configuration (MONGO_URL or DB_NAME).",
    );
  }

  try {
    const connection = await mongoose.connect(MONGO_URL, {
      dbName: DB_NAME,
    });

    // Ping the database to confirm connectivity
    if (connection.connection.db?.admin) {
      await connection.connection.db.admin().command({ ping: 1 });
    }

    console.info(
      `✅ MongoDB Connected! Host: ${connection.connection.host}, DB: ${DB_NAME}\n`,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Unable to connect to MongoDB:", error.message);
    } else {
      console.error("❌ Unable to connect to MongoDB:", error);
    }

    const errorMessage = `❌ Unable to connect to MongoDB: ${error instanceof Error ? error.message : error}`;

    throw new ApiError(500, errorMessage);
  }
}
