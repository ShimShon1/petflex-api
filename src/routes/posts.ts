import { Router } from "express";
import {
  getPostWithAllComments,
  getPosts,
  likePost,
  postPosts,
} from "../controllers/posts.js";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { getPostByParam } from "../middlewares/posts.js";

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

router.get("/:postId", getPostByParam, getPostWithAllComments);

router.post("/:postId/likes", auth, getPostByParam, likePost);

export default router;
