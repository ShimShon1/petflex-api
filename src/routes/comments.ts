import { Router } from "express";
import {
  deleteComment,
  getComments,
  postComment,
} from "../controllers/comments.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import { commentValidation } from "../middlewares/validations.js";
import { commentLimiter } from "../middlewares/limiters.js";

const router = Router();

router.post(
  "/:postId",
  commentLimiter,
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
