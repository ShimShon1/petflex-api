import express from "express";
import Post from "../models/Post.js";

export function postPosts(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const {
    name,
    user,
    description,
    image,
    gender,
    birthDate,
    comments,
    createdAt,
    petType,
  } = req.body;
  const pet = {
    name,
    user,
    description,
    image,
    gender,
    birthDate,
    comments,
    createdAt,
    petType,
  };
  const post = new Post(pet);
  post.save();
  return res.json({ post });
}

export async function getPosts(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const posts = await Post.find().populate("user");
  console.log(posts[posts.length - 1]);
  res.json(posts[posts.length - 1]);
}
