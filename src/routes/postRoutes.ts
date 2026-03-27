import { Router } from "express";
import * as postController from "../controllers/postController";
import protect from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect , postController.createPost);
router.get("/", protect , postController.getPosts);
router.post("/:postId/like", protect , postController.likePost);
router.post("/:postId/comment", protect, postController.commentPost);


// Reply to a comment
router.post("/:postId/comment/:commentId/reply", protect, postController.replyToComment);

// Get users who liked a post
router.get("/:postId/likes", protect, postController.getPostLikes);

router.post("/filter", protect, postController.getPosts);

export default router;