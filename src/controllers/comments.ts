import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import { UserRequest } from "../types.js";
import express from "express";
import fetchReplies from "../helpers/fetchReplies.js";

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

export async function getComments(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.postId);

    const topLevelComments = await Comment.find({
      postId: postId,
      parentId: null,
    });

    const topLevelCommentsWithReplies = [];
    for (const comment of topLevelComments) {
      const commentObject: any = comment.toObject();
      if (commentObject.hasReplies) {
        commentObject.replies = await fetchReplies(comment._id);
      } else {
        commentObject.replies = [];
      }
      topLevelCommentsWithReplies.push(commentObject);
    }
    const comments = topLevelCommentsWithReplies;

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    next(error);
  }
}
