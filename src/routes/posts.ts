import express from "express";
import {
  getPosts,
  likePost,
  postPosts,
  reply,
} from "../controllers/posts.js";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { UserRequest } from "../types.js";
import { getPostByParam } from "../middlewares/posts.js";
import { makeStringValidator } from "../helpers/make_validators.js";
import { commentOnPost } from "../controllers/comments.js";
import { isObjectIdOrHexString } from "mongoose";
import Reply from "../models/Reply.js";
const router = express.Router();

router.post(
  "/",
  auth,
  upload.single("img"),
  postValidation,
  validate,
  postPosts
);

router.get("/", getPosts);
router.get("/:postId", getPostByParam, (req: UserRequest, res) =>
  res.json({ post: req.context.post })
);
router.post("/:postId/likes", auth, getPostByParam, likePost);
router.post(
  "/:postId/comments",
  auth,
  getPostByParam,
  makeStringValidator("comment", { min: 3, max: 200 }),
  validate,
  commentOnPost
);

//post reply to a comment
router.post(
  "/:postId/comments/:commentId/replies",
  auth,
  getPostByParam,
  makeStringValidator("comment", { min: 3, max: 200 }),
  validate,
  reply
);

export default router;
