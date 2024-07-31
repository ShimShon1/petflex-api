import { UserRequest } from "../types.js";
import express from "express";
export async function commentOnPost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { user, post } = req.context;
    post.comments.push({ user: user._id, comment: req.body.comment });
    await req.context.post.save();
    res.json({ comments: post.comments });
  } catch (error) {
    next(error);
  }
}
