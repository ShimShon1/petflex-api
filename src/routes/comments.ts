import { Router } from "express";
import {
  deleteComment,
  getComments,
  postComment,
} from "../controllers/comments.js";
import validate from "../middlewares/validate.js";
import { makeStringValidator } from "../helpers/make_validators.js";
import auth from "../middlewares/auth.js";
import { commentValidation } from "../middlewares/validations.js";

const router = Router();

router.post(
  "/:postId",
  auth,
  commentValidation,
  validate,
  postComment,
  getComments
);

router.get("/:postId", getComments);

router.delete(
  "/:postId/:commentId",
  auth,
  deleteComment,
  getComments
);

export default router;
