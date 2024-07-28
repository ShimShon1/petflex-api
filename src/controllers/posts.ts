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

//get single post
export async function getPostById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (!isObjectIdOrHexString(req.params.id)) {
      return res.status(404).json({
        errors: [{ msg: "post not found, id is probably invalid" }],
      });
    }
    const post = await Post.findOne({ _id: req.params.id });
    if (post === null) {
      return res
        .status(404)
        .json({ errors: [{ msg: "post not found" }] });
    }
    return res.json({ post });
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "There was an error" }] });
  }
}
