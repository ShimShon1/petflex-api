import express from "express";
import Post from "../models/Post.js";
import { UserRequest } from "../types.js";

export async function getPosts(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const page = Number(req.query?.page) || 1;
    //change for actual production to show more for inital page.
    const limit = 2;
    const skip = (page - 1) * 2;
    console.log("skipping", skip);
    const posts = await Post.find({}, { imageName: 0 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const post = req.context.post.toObject();
    res.status(200).json({ ...post });
  } catch (error) {
    next(error);
  }
}
