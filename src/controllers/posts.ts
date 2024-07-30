import express from "express";
import Post from "../models/Post.js";
import { isObjectIdOrHexString } from "mongoose";
import { UserRequest } from "../types.js";

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
      comments: req.body.comments,
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
  res: express.Response
) {
  try {
    const posts = await Post.find().populate("user", "username");
    res.json(posts);
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "There was an error" }] });
  }
}

export async function likePost(
  req: UserRequest,
  res: express.Response
) {
  try {
    const id = req.context.user._id.toString();
    const post = req.context.post;
    if (post.likes.includes(id)) {
      post.likes = post.likes.filter(
        (l: string) => l.toString() !== id
      );
      await post.save();
      return res.status(200).json({ likes: post.likes });
    } else {
      post.likes.push(id);
      await post.save();
      return res.status(200).json({ likes: post.likes });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "There was an error" }] });
  }
}

export async function commentOnPost(
  req: UserRequest,
  res: express.Response
) {
  const { user, post } = req.context;
  post.comments.push({ user: user._id, comment: req.body.comment });
  await req.context.post.save();
  res.json({ comments: post.comments });
}
