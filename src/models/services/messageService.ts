import { IMessage } from "../../types";
// import { pool } from "../../config/db"; 
// import { ResultSetHeader } from "mysql2"; 
import { prisma } from "../../prisma"; 

// const FETCH_MESSAGES_QUERY = `
//   SELECT 
//       m.id,
//       m.message,
//       m.created_at,
//       s.id AS sender_id,
//       s.name AS sender_name,
//       r.id AS receiver_id,
//       r.name AS receiver_name
//   FROM messages m
//   JOIN users s ON m.sender_id = s.id
//   JOIN users r ON m.receiver_id = r.id
//   WHERE (m.sender_id = ? AND m.receiver_id = ?)
//      OR (m.sender_id = ? AND m.receiver_id = ?)
//   ORDER BY m.created_at ASC
// `;

// const ADD_MESSAGE_QUERY = `
//   INSERT INTO messages (sender_id, receiver_id, message) 
//   VALUES (?, ?, ?)
// `;

export const fetchMessagesBetweenUsers = async (
  senderId: string,
  receiverId: string
): Promise<IMessage[]> => {
  const sender = parseInt(senderId, 10);
  const receiver = parseInt(receiverId, 10);

  // const [rows] = await pool.query<IMessage[]>(FETCH_MESSAGES_QUERY, [
  //   sender,
  //   receiver,
  //   receiver,
  //   sender,
  // ]);

  const rows = await prisma.messages.findMany({
    where: {
      OR: [
        { sender_id: sender, receiver_id: receiver },
        { sender_id: receiver, receiver_id: sender },
      ],
    },
    include: {
      users_messages_sender_idTousers: {
        select: { id: true, name: true },
      },
      users_messages_receiver_idTousers: {
        select: { id: true, name: true },
      },
    },
    orderBy: { created_at: "asc" },
  });

  return rows.map((msg) => ({
    id: msg.id,
    message: msg.message,
    created_at: msg.created_at,
    senderid: msg.sender_id,
    receiverid: msg.receiver_id,
  }));
};

export const addMessage = async (
  senderId: number,
  receiverId: number,
  message: string
): Promise<number> => {
  // const [result] = await pool.query<ResultSetHeader>(ADD_MESSAGE_QUERY, [
  //   senderId,
  //   receiverId,
  //   message,
  // ]);

  const newMsg = await prisma.messages.create({
    data: {
      sender_id: senderId,
      receiver_id: receiverId,
      message,
    },
  });

  return newMsg.id;
};