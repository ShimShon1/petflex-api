import express from "express";
import {
  getPostById,
  getPosts,
  postPosts,
} from "../controllers/posts.js";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { UserRequest } from "../types.js";
const router = express.Router();

// router.post("/", auth, postValidation, validate, postPosts);
router.post(
  "/",
  auth,
  upload.single("img"),
  postValidation,
  validate,
  postPosts
);

router.get("/", getPosts);
router.get("/:id", getPostById);

function test(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  console.log(req.body);
  console.log(req.file);
  console.log(req.context);
  return res.json({
    msg: "returned",
    img: req.file?.path,
    context: req.context,
  });
}

export default router;
