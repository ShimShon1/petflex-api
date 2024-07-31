import express from "express";
import Post from "../models/Post.js";
import { isObjectIdOrHexString } from "mongoose";
import { UserRequest } from "../types.js";
import Reply from "../models/Reply.js";

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
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const posts = await Post.find().populate("user", "username");

    res.json(posts);
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
    next(error);
  }
}

export async function reply(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  //find comment, then add validated reply to it
  const { post, user } = req.context;
  if (!isObjectIdOrHexString(req.params.commentId)) {
    return res.status(404).json({
      errors: [{ msg: "comment not found, id is probably invalid" }],
    });
  }
  const comments = post.comments;
  if (!comments.length) {
    return res.status(404).json({
      errors: [
        { msg: "no comments on post, perhaps they got deleted" },
      ],
    });
  }
  const comment = comments.find(
    (c: any) => c._id == req.params.commentId
  );

  if (!comment) {
    return res.status(404).json({
      errors: [{ msg: "comment not found" }],
    });
  }
  const reply = new Reply({
    user: user._id,
    comment: req.body.comment,
  });

  reply.save();

  comment.replies.push(reply._id);
  post.save();
  return res.json({ comment, reply, post });
}
