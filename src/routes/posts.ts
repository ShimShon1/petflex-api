import { Router } from "express";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { getPostByParam } from "../middlewares/getPostByParam.js";
import checkSameUser from "../middlewares/checkSameUser.js";
import { getPost, getPosts } from "../controllers/getPosts.js";
import {
  deletePost,
  likePost,
  postPosts,
} from "../controllers/postPosts.js";

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

router.get("/:postId", getPostByParam, getPost);

router.post("/:postId/likes", auth, getPostByParam, likePost);

router.delete(
  "/:postId",
  auth,
  getPostByParam,
  checkSameUser,
  deletePost
);

export default router;
