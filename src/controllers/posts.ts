import express from "express";
import Post from "../models/Post.js";
import { isObjectIdOrHexString, isValidObjectId } from "mongoose";

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
  res: express.Response
) {
  try {
    const posts = await Post.find();
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
