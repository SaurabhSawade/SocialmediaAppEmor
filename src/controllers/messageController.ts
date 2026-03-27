import { Request, Response } from "express";
import { fetchMessagesBetweenUsers } from "../models/services/messageService"; 

export const getMessages = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await fetchMessagesBetweenUsers(senderId as string , receiverId as string);
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};