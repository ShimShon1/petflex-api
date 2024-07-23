import express from "express";
import { getPosts, postPosts } from "../controllers/posts.js";
import auth from "../middlewares/auth.js";
import { postValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
const router = express.Router();

router.post("/", auth, postValidation, validate, postPosts);
router.get("/", getPosts);
export default router;
