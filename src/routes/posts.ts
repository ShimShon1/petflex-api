import { Router } from "express";
import {
  getFullPost,
  getPosts,
  likePost,
  postPosts,
} from "../controllers/posts.js";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { getPostByParam } from "../middlewares/posts.js";
import { makeStringValidator } from "../helpers/make_validators.js";
import { commentOnPost, reply } from "../controllers/comments.js";

const router = Router();

router.get("/", getPosts);

router.post(
  "/",
  auth,
  upload.single("img"),
  postValidation,
  validate,
  postPosts
);

router.get("/:postId", getFullPost);

router.post("/:postId/likes", auth, getPostByParam, likePost);

router.post(
  "/:postId/comments",
  auth,
  getPostByParam,
  makeStringValidator("content", { min: 3, max: 200 }),
  validate,
  commentOnPost
);

//post reply to a comment
router.post(
  "/:postId/comments/:commentId/replies",
  auth,
  getPostByParam,
  makeStringValidator("content", { min: 3, max: 200 }),
  validate,
  reply
);

export default router;
