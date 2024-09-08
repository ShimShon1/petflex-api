import express from "express";
import Post from "../models/Post.js";
import { UserRequest } from "../types.js";

export async function getPosts(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const posts = await Post.find().populate("user", "username");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const post = req.context.post.toObject();
    res.status(200).json({ ...post });
  } catch (error) {
    next(error);
  }
}
