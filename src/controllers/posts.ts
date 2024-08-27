import express from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

import { UserRequest } from "../types.js";
import mongoose from "mongoose";
import fetchReplies from "../helpers/fetchReplies.js";

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

export async function deletePost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const postId = req.params.postId;
    await Comment.deleteMany({
      postId: postId,
    });
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    next(error);
  }
}
