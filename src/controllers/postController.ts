import { Request, Response } from "express";
import * as postService from "../models/postModel";
import moment from "moment";
import { log } from "console";

// Create Post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, image } = req.body;
    // console.log("USER", req.user);
    const userId = req.user.id;

    if (!content) return res.status(400).json({ message: "Content required" });

    const post = await postService.createPost(userId, content, image);
    res.status(201).json(post);
  } catch (err: any) {
    console.error("Error in createPost:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (req.query.startDate) {
    startDate = moment(req.query.startDate).startOf('day').toDate(); // set start of day
  }

  if (req.query.endDate) {
    endDate = moment(req.query.endDate).endOf('day').toDate(); // set end of day
  }

  try {
    const posts = await postService.getPosts(page, limit, startDate, endDate);
    return res.json({success:true, status:200,message: "Posts fetched successfully",data: posts});
  } catch (err: any) {
    console.error("Error in getPosts:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  // console.log("USER ", req.user);
  const userId = req.user.id;

  try {
    const like = await postService.likePost(userId, Number(postId));
    res.json(like);
  } catch (err: any) {
    console.error("Error in likePost:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Comment on a Post
export const commentPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id ;

  try {
    const comment = await postService.commentPost(userId, Number(postId), content);
    res.json(comment);
  } catch (err: any) {
    console.error("Error in commentPost:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const replyToComment = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const reply = await postService.replyToComment(
      userId,
      Number(postId),
      Number(commentId),
      content
    );

    res.json(reply);
  } catch (err: any) {
    console.error("Error in replyToComment:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const getPostLikes = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const likes = await postService.getPostLikes(Number(postId));
    res.json(likes);
  } catch (err: any) {
    console.error("Error in getPostLikes:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};