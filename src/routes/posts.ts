import { NextFunction, Router, Response } from "express";
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
  likePost,
  postPost,
} from "../controllers/mutatePosts.js";
import { UserRequest } from "../types.js";
import Post from "../models/Post.js";

const router = Router();

router.get("/", getPosts);
router.get("/private", auth, populateUser, getPrivatePosts);

router.post(
  "/",
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

//get private posts
async function getPrivatePosts(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (
      !process.env.ADMINS?.split(",").includes(req.context.user._id)
    ) {
      return res
        .status(403)
        .json({ errors: [{ msg: "not an admin" }] });
    }
    const posts = await Post.find({ public: false }).populate(
      "user",
      "username"
    );
    res.json(posts);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//make public
router.put("/:postId/public", auth, getPostByParam, makePostPublic);

function makePostPublic(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (
      !process.env.ADMINS?.split(",").includes(req.context.user._id)
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

function disabled(
  req: Express.Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(500)
      .json({ errors: [{ msg: "Posting is temporarily disabled" }] });
  } catch (err) {
    next(err);
  }
}

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
