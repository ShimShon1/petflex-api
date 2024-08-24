import express from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

import { UserRequest } from "../types.js";
import mongoose, { isObjectIdOrHexString } from "mongoose";

export async function postPosts(
  req: UserRequest,
  res: express.Response
) {
  try {
    const post = new Post({
      name: req.body.name,
      user: req.context.user._id,
      description: req.body.description,
      image: req.file?.path,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
      petType: req.body.petType,
    });
    await post.save();
    return res.json({ post });
  } catch (error) {
    console.log(error);
    const msg = (error as Error).message;
    return res.status(500).json({ errors: [{ msg }] });
  }
}

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

export async function likePost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const id = req.context.user._id.toString();
    const post = req.context.post;
    if (post.likes.includes(id)) {
      post.likes = post.likes.filter(
        (l: string) => l.toString() !== id
      );
    } else {
      post.likes.push(id);
    }

    await post.save();
    return res.status(200).json({ likes: post.likes });
  } catch (error) {
    next(error);
  }
}

export async function getFullPost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  //get post with all replies
  try {
    if (!isObjectIdOrHexString(req.params.postId)) {
      return res.status(404).json({
        errors: [{ msg: "Post not found, id is probably invalid" }],
      });
    }
    const post = await Post.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.postId),
        },
      },
    ]);

    const comments = await Comment.find({
      postId: req.params.postId,
    });
    console.log(comments);
    if (!post.length) {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.json({ post: post[0], comments });
  } catch (error) {
    next(error);
  }
}

async function fetchReplies(commentId: mongoose.Types.ObjectId) {
  const replies = await Comment.find({ parentId: commentId }).exec();
  const repliesWithNestedReplies = [];

  for (const reply of replies) {
    const replyObject: any = reply.toObject();
    replyObject.replies = await fetchReplies(reply._id);
    repliesWithNestedReplies.push(replyObject);
  }

  return repliesWithNestedReplies;
}

export async function getPostWithAllComments(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.postId);

    const topLevelComments = await Comment.find({
      postId: postId,
      parentId: null,
    }).exec();

    const topLevelCommentsWithReplies = [];

    for (const comment of topLevelComments) {
      const commentObject: any = comment.toObject();
      commentObject.replies = await fetchReplies(comment._id);
      topLevelCommentsWithReplies.push(commentObject);
    }

    res.json({
      postId: postId,
      comments: topLevelCommentsWithReplies,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
