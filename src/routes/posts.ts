import { NextFunction, Router, Response } from "express";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { getPostByParam } from "../middlewares/getPostByParam.js";
import checkSameUser from "../middlewares/checkSameUser.js";

import {
  getPost,
  getPosts,
  getPrivatePosts,
  getSelfPosts,
} from "../controllers/getPosts.js";
import {
  deletePost,
  editPost,
  likePost,
  makePostPublic,
  postPost,
} from "../controllers/mutatePosts.js";
import { UserRequest } from "../types.js";
import { postLimiter } from "../middlewares/limiters.js";

const router = Router();

router.get("/", getPosts);
router.get("/private", auth, populateUser, getPrivatePosts);

router.get("/self", auth, getSelfPosts);

router.post(
  "/",
  postLimiter,
  auth,
  upload.single("image"),
  postValidation,
  validate,
  postPost
);

router.put(
  "/:postId",
  auth,
  populateUser,
  getPostByParam,
  checkSameUser,
  postValidation,
  validate,
  editPost
);
router.get("/:postId", populateUser, getPostByParam, getPost);

router.post("/:postId/likes", auth, getPostByParam, likePost);

router.delete(
  "/:postId",
  auth,
  getPostByParam,
  checkSameUser,
  deletePost
);

//make public
router.put("/:postId/public", auth, getPostByParam, makePostPublic);

function populateUser(
  req: UserRequest,
  res: Express.Response,
  next: NextFunction
) {
  req.context = {
    ...req.context,
    populateUser: true,
  };
  next();
}

export default router;
