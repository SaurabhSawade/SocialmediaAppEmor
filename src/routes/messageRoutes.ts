// const express = require("express");
import express from "express";

// const router = express.Router();
const router = express.Router();

// const { getMessages } = require("../../controllers/messageController");
import { getMessages } from "../controllers/messageController";

// const protect = require("../middleware/authMiddleware");
import protect from "../middleware/authMiddleware";

// Fetch messages between two users

// router.get("/:senderId/:receiverId", protect, getMessages);
router.get("/:senderId/:receiverId", protect, getMessages);

// module.exports = router;
export default router;