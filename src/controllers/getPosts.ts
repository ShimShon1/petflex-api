import express from "express";
import Post from "../models/Post.js";
import { petTypes, UserRequest } from "../types.js";

export async function getPosts(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    //sort by?
    let order = Number(req.query.order) || -1;

    const sort: any =
      req.query.sortBy === "likes"
        ? {
            likesCount: order,
            createdAt: -1,
          }
        : {
            createdAt: order,
          };

    //get query settings (so far only pettype)
    const query =
      req.query.petType != "" &&
      petTypes.includes(String(req.query.petType))
        ? { petType: req.query.petType, public: true }
        : { public: true };

    //calculate amount of posts to send
    //change for actual production to show more for inital page.
    const page = Number(req.query.page) || 1;
    const limit = page === 1 ? 9 : 6;
    const skip = page === 1 ? 0 : (page - 2) * 6 + 9;

    const posts = await Post.find(query, { imageName: 0 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username")
      .sort(sort);

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
    if (post.public) {
      return res.status(200).json({ ...post });
    }
    return res
      .status(404)
      .json({ errors: [{ msg: "post not found" }] });
  } catch (error) {
    next(error);
  }
}
