import express from "express";
import Post from "../models/Post.js";

export function postPosts(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { name, user, description, image, gender, age, comments } =
    req.body;
  const pet = {
    name,
    user,
    description,
    image,
    gender,
    age,
    comments,
  };
  const post = new Post(pet);
  post.save();
  return res.json({ pet });
}

export async function getPosts(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const posts = await Post.find().populate("user");
  res.json(posts);
}
