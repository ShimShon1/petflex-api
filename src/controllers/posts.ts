import express from "express";
import Post from "../models/Post.js";

export async function postPosts(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
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
  const posts = await Post.find();
  res.json(posts);
}
