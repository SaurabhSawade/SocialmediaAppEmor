import { prisma } from "../prisma";
import { IMessage } from "../types";

// fetch messages between two users
export const fetchMessagesBetweenUsers = async (
  sender: number,
  receiver: number
): Promise<IMessage[]> => {
  return prisma.messages.findMany({
    where: {
      OR: [
        { sender_id: sender, receiver_id: receiver },
        { sender_id: receiver, receiver_id: sender },
      ],
    },
    orderBy: { created_at: "asc" },
  });
};

// add a new message
export const addMessage = async (
  senderId: number,
  receiverId: number,
  message: string
) => {
  return prisma.messages.create({
    data: {
      sender_id: senderId,
      receiver_id: receiverId,
      message,
    },
  });
};