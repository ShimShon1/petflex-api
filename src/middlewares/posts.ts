import express from "express";
import { isObjectIdOrHexString } from "mongoose";
import Post from "../models/Post.js";
import { UserRequest } from "../types.js";

//get single post
export async function getPostByParam(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (!isObjectIdOrHexString(req.params.postId)) {
      return res.status(404).json({
        errors: [{ msg: "post not found, id is probably invalid" }],
      });
    }
    const post = await Post.findOne({ _id: req.params.postId });

    // console.log(post, req.params.postId);
    if (post === null) {
      return res
        .status(404)
        .json({ errors: [{ msg: "post not found" }] });
    }
    req.context = { ...req.context, post };
    next();
    return;
  } catch (error) {
    next(error);
  }
}
