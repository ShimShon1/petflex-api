import { NextFunction, Router } from "express";
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

const router = Router();

router.get("/", getPosts);

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
