import mongoose, { isObjectIdOrHexString } from "mongoose";
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
      postId: req.params.postId,
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
        errors: [{ msg: "comment not found, probably deleted" }],
      });
    }
    // console.log(comment);

    // check for replies, delete if it doesn't have any
    if (!comment.hasReplies) {
      await comment.deleteOne();
      res.json({ msg: "deleted comment" });
      //check if parent comment has more replies, if it doesnt, change parent hasReplies prop
      if (comment.parentId) {
        const hasMoreReplies = await Comment.exists({
          parentId: comment.parentId,
        });
        if (!hasMoreReplies) {
          const parentComment = await Comment.findById(
            comment.parentId
          );
          if (parentComment) {
            //if unavilable, delete.
            if (!parentComment.availble) {
              await parentComment.deleteOne();
              return;
            }
            parentComment.hasReplies = false;
            parentComment.save();
          }
        }
        return;
      }
    } else if (comment.hasReplies) {
      //if comment does have replies, modify
      comment.content = "this comment has been deleted";
      comment.availble = false;
      await comment.save();
      return res.json({ msg: "has replies, modified" });
    }
  } catch (error) {
    next(error);
  }
}
