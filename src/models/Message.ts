// const mongoose = require("mongoose");
import mongoose, { Schema, Document, model, Types } from "mongoose";

// const { Schema } = mongoose;

 export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// const messageSchema = new Schema(
const messageSchema: Schema<IMessage> = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Message", messageSchema);
export default model<IMessage>("Message", messageSchema);