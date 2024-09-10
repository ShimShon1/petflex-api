import { Router } from "express";
import {
  deleteComment,
  getComments,
  postComment,
} from "../controllers/comments.js";
import validate from "../middlewares/validate.js";
import { makeStringValidator } from "../helpers/make_validators.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post(
  "/:postId",
  auth,
  makeStringValidator("content", { min: 3, max: 200 }),
  validate,
  postComment,
  getComments
);

router.get("/:postId", getComments);

router.delete("/:commentId", deleteComment);

export default router;
