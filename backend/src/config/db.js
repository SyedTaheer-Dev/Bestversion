import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || "best_version";

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected (${mongoose.connection.name})`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

export default connectDB;