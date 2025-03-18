import { destroy } from "../middlewares/upload.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { UserRequest } from "../types.js";
import express from "express";
export async function postPost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const posted = await Post.countDocuments({
      user: req.context.user._id,
    });
    if (posted >= 7) {
      destroy(req.file?.filename || "");
      return res
        .status(400)
        .json({ errors: [{ msg: "you posted too many pets" }] });
    }
    const post = new Post({
      name: req.body.name,
      user: req.context.user._id,
      description: req.body.description,
      image: req.file?.path,
      imageName: req.file?.filename,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
      petType: req.body.petType,
      isDead: req.body.isDead,
    });
    await post.save();
    res.json({ msg: "Posted" });
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
    post.isDead = body.isDead;

    await post.save();
    return res.json(post);
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
        (like: string) => like.toString() !== id
      );
    } else {
      post.likes.push(id);
    }

    post.likesCount = post.likes.length;
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

export function makePostPublic(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (
      !process.env.ADMINS?.split(",").includes(
        req.context.user._id.toString()
      )
    ) {
      return res
        .status(403)
        .json({ errors: [{ msg: "not an admin" }] });
    }
    req.context.post.public = true;
    req.context.post.save();
    return res.json({ msg: "Post made public" });
  } catch (error) {
    next(error);
  }
}
