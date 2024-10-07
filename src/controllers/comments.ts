import mongoose, { isObjectIdOrHexString } from "mongoose";
import Comment from "../models/Comment.js";
import { UserRequest } from "../types.js";
import express from "express";
import fetchReplies from "../helpers/fetchReplies.js";
import Post from "../models/Post.js";

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
      postId: req.params.postId,
    });
    await comment.save();
    if (req.body.parentId) {
      const parent = await Comment.findById(req.body.parentId);
      if (parent == null) {
        return res.status(404).json({ msg: "comment not found" });
      }
      parent.hasReplies = true;
      await parent.save();
    }

    //increase comments count by 1
    await Post.updateOne(
      { _id: req.params.postId },
      { $inc: { commentsCount: 1 } }
    );

    next();
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
    const comments = await Comment.find({
      postId,
    }).populate("user", "username");

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    //get comment or error handle if id is incorrect
    if (!isObjectIdOrHexString(req.params.commentId)) {
      return res
        .status(404)
        .json({ errors: [{ msg: "invalid id, comment not found" }] });
    }
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        errors: [
          {
            msg: "comment not found, probably deleted or unavailable",
          },
        ],
      });
    }

    if (comment.available === false && comment.hasReplies) {
      return res.status(404).json({
        errors: [
          {
            msg: "comment still has replies",
          },
        ],
      });
    }

    if (String(req.context.user._id) !== String(comment.user)) {
      return res.status(403).json({
        errors: [{ msg: "Not the same user" }],
      });
    }

    // check for replies, delete if it doesn't have any
    if (!comment.hasReplies) {
      await comment.deleteOne();
      //check if parent comment has more replies, if it doesnt, change parent hasReplies prop
      if (comment.parentId) {
        const hasMoreReplies = await Comment.exists({
          parentId: comment.parentId,
        });
        if (!hasMoreReplies) {
          const parentComment = await Comment.findById(
            comment.parentId
          );

          parentComment!.hasReplies = false;
          await parentComment!.save();
        }
      }
    } else if (comment.hasReplies) {
      //if comment does have replies, modify
      comment.content = "this comment has been deleted";
      comment.available = false;
      await comment.save();
    }
    //decrease comments count by 1
    await Post.updateOne(
      { _id: comment.postId },
      { $inc: { commentsCount: -1 } }
    );
    return next();
  } catch (error) {
    next(error);
  }
}
