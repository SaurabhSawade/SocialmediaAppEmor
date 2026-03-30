// const mongoose = require("mongoose");
import mongoose from "mongoose";
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chatapp";
// const connectDB = async () => {
const connectDB = async (): Promise<void> => {
  try {
    if (!MONGO_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected");
  } catch (err) {
    // Typed error handling
    if (err instanceof Error) {
      console.error("MongoDB connection error:", err.message);
    } else {
      console.error("Unknown MongoDB connection error:", err);
    }
  }
};

// module.exports = connectDB;
export default connectDB;