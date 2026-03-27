import express, { Request, Response } from "express";
// import { pool } from "../config/db"; 
import { IMessage } from "../types";
import { fetchMessagesBetweenUsers } from "../models/messageModel";
const router = express.Router();

router.get("/:userId/:otherUserId", async (req: Request, res: Response) => {
  const { userId, otherUserId } = req.params;
  const sender = parseInt(userId as string, 10);
  const receiver = parseInt(otherUserId as string, 10);

  try {
    // const query = `
    //   SELECT *
    //   FROM messages
    //   WHERE (senderid = ? AND receiverid = ?)
    //      OR (senderid = ? AND receiverid = ?)
    //   ORDER BY created_at ASC
    // `;
    // const [rows] = await pool.execute<IMessage[]>(query, [
    //   userId,
    //   otherUserId,
    //   otherUserId,
    //   userId,
    // ]);

    const rows = await fetchMessagesBetweenUsers(sender, receiver);

    res.json(
      rows.map((msg) => ({
        id: msg.id,
        message: msg.message,
        created_at: msg.created_at,
        senderid: msg.sender_id,
        receiverid: msg.receiver_id,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;