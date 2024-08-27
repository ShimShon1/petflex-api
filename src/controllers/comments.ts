import Comment from "../models/Comment.js";
import { UserRequest } from "../types.js";
import express from "express";

//create top level comments
export async function postComment(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { user } = req.context;
    const comment = new Comment({
      user: user._id,
      content: req.body.content,
      parentId: req.body.parentId,
      postId: req.body.postId,
    });
    await comment.save();
    if (req.body.parentId) {
      const parent = await Comment.findById(req.body.parentId);
      if (parent == null) {
        return res.status(404).json({ msg: "comment not found" });
      }
      parent.hasReplies = true;
      parent.save();
    }
    res.json({ msg: "comment posted" });
  } catch (error) {
    next(error);
  }
}
