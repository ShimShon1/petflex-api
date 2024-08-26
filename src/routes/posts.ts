import { Router } from "express";
import {
  deletePost,
  getPostWithAllComments,
  getPosts,
  likePost,
  postPosts,
} from "../controllers/posts.js";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { getPostByParam } from "../middlewares/getPostByParam.js";
import checkSameUser from "../middlewares/checkSameUser.js";

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

router.delete(
  "/:postId",
  auth,
  getPostByParam,
  checkSameUser,
  deletePost
);

export default router;
