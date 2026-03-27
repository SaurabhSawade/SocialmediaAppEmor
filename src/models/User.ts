// const mongoose = require("mongoose");
import mongoose, { Document, Schema, model } from "mongoose";

// const userShema = mongoose.Schema({
const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// module.exports = mongoose.model("User", userShema);
export default model<IUser>("User", userSchema);

// TypeScript interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}