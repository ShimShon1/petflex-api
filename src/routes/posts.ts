import express from "express";
import { getPosts, postPosts } from "../controllers/posts.js";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { UserRequest } from "../types.js";
import { getPostByParam } from "../middlewares/posts.js";
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
  res.json({ context: req.context })
);
router.post("/:id/like", auth, getPostByParam, likePost);

async function likePost(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const id = req.context.user._id.toString();

  return res.json({ context: req.context });
}

export default router;
