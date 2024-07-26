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
const router = express.Router();

// router.post("/", auth, postValidation, validate, postPosts);
router.post("/", upload.single("img"), test);

router.get("/", getPosts);
router.get("/:id", getPostById);

function test(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log(req.body);
  console.log(req.file);
  return res.json({ msg: "returned", img: req.file?.path });
}

export default router;
