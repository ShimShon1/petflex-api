import { destroy } from "../middlewares/upload.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { UserRequest } from "../types.js";
import express from "express";
export async function postPosts(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const post = new Post({
      name: req.body.name,
      user: req.context.user._id,
      description: req.body.description,
      image: req.file?.path,
      imageName: req.file?.filename,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
      petType: req.body.petType,
    });
    await post.save();
    return res.json({ post });
  } catch (error) {
    next(error);
  }
}

export async function editPost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const post = req.context.post;
    const body = req.body;

    post.name = body.name;
    post.description = body.description;
    post.gender = body.gender;
    post.petType = body.petType;
    post.birthDate = body.birthDate;

    await post.save();
    return res.json({ post });
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
    destroy(req.context.post.imageName);
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    next(error);
  }
}
