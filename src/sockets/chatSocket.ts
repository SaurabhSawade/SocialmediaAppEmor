import { Server, Socket } from "socket.io";
// import { pool } from "../config/db"; 
// import { ResultSetHeader } from "mysql2";
import { addMessage } from "../models/messageModel";

const chatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected", socket.id);

    socket.on("join", (userId: string) => {
      if (!userId) return;
      socket.data.userId = userId;
      socket.join(userId.toString());
      console.log(`User ${userId} joined room`);
    });

    socket.on(
      "sendMessage",
      async (data: { receiver: string; message: string }) => {
        try {
          const senderId = parseInt(socket.data.userId, 10);
          const receiverId = parseInt(data.receiver, 10);

          if (!senderId || !receiverId || !data.message) return;

          // const query = `
          //   INSERT INTO messages (sender_id, receiver_id, message)
          //   VALUES (?, ?, ?)
          // `;
          // const [result] = await pool.execute<ResultSetHeader>(query, [
          //   senderId,
          //   receiverId,
          //   data.message,
          // ]);

          const newMessage = await addMessage(senderId, receiverId, data.message);

          const messageData = {
            id: newMessage.id,
            sender: { id: senderId, name: "You" }, 
            receiver: { id: receiverId },
            message: newMessage.message,
            created_at: newMessage.created_at?.toISOString() ?? new Date().toISOString(),
          };

          io.to(receiverId.toString()).emit("receiverMessage", messageData);
          socket.emit("receiverMessage", messageData);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};

export default chatSocket;