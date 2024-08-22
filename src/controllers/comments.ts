import { isObjectIdOrHexString } from "mongoose";
import Comment from "../models/Comment.js";
import { UserRequest } from "../types.js";
import express from "express";

//create top level comments
export async function commentOnPost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { user, post } = req.context;
    const comment = new Comment({
      user: user._id,
      content: req.body.content,
    });
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    res.json({ comments: post.comments });
  } catch (error) {
    next(error);
  }
}

//reply to comments, at any level besides top
export async function reply(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    //find comment, then add validated reply to it
    const { post, user } = req.context;
    if (!isObjectIdOrHexString(req.params.commentId)) {
      return res.status(404).json({
        errors: [
          { msg: "comment not found, id is probably invalid" },
        ],
      });
    }
    const comments = post.comments;
    if (!comments.length) {
      return res.status(404).json({
        errors: [
          { msg: "no comments on post, perhaps they got deleted" },
        ],
      });
    }
    const comment = await Comment.findById(req.params.commentId);
    if (comment == null) {
      return res.status(404).json({
        errors: [{ msg: "comment not found" }],
      });
    }
    const reply = new Comment({
      user: user._id,
      content: req.body.content,
    });

    await reply.save();

    comment.replies.push(reply._id);
    await post.save();
    await comment.save();
    return res.json({ comment });
  } catch (error) {
    next(error);
  }
}
