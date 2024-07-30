import express from "express";
import {
  commentOnPost,
  getPosts,
  likePost,
  postPosts,
} from "../controllers/posts.js";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { UserRequest } from "../types.js";
import { getPostByParam } from "../middlewares/posts.js";
import { makeStringValidator } from "../helpers/make_validators.js";
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
router.get("/:id", getPostByParam, (req: UserRequest, res) =>
  res.json({ post: req.context.post })
);
router.post("/:id/like", auth, getPostByParam, likePost);
router.post(
  "/:id/comment",
  auth,
  getPostByParam,
  makeStringValidator("comment", { min: 3, max: 200 }),
  validate,
  commentOnPost
);

export default router;
