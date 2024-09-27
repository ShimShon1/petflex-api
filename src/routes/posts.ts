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
  editPost,
  fakePostPosts,
  likePost,
  postPosts,
} from "../controllers/mutatePosts.js";
import multer from "multer";
import { UserRequest } from "../types.js";

const router = Router();

router.get("/", getPosts);

router.post(
  "/",
  auth,
  upload.single("image"),
  postValidation,
  validate,
  postPosts
);

router.put(
  "/:postId",
  auth,
  getPostByParam,
  checkSameUser,
  postValidation,
  validate,
  editPost
);
router.get(
  "/:postId",
  (req: UserRequest, res, next) => {
    req.context = {
      ...req.context,
      populateUser: true,
    };
    next();
  },
  getPostByParam,
  getPost
);

router.post("/:postId/likes", auth, getPostByParam, likePost);

router.delete(
  "/:postId",
  auth,
  getPostByParam,
  checkSameUser,
  deletePost
);

export default router;
