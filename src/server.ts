// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();  ;
import http from "http";
// const { Server } = require("socket.io");
import { Server } from "socket.io"
import app from "./app";
import chatSocket from "./sockets/chatSocket";
import { prisma } from "./prisma"; 

async function testConnection() {
  try {
    const users = await prisma.users.findMany({ take: 1 });
    console.log("DB is working, users count:", users.length);
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}

testConnection();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
chatSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//wefi