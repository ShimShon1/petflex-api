import express from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

import { UserRequest } from "../types.js";
import mongoose from "mongoose";
import fetchReplies from "../helpers/fetchReplies.js";

export async function getPosts(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const posts = await Post.find().populate("user", "username");

    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPostWithAllComments(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let { post } = req.context;
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
    post = post.toObject();
    post.comments = topLevelCommentsWithReplies;

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
}
