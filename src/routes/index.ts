import express from "express";
import { login, register } from "../controllers/users.js";
import { userValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import { makeStringValidator } from "../helpers/make_validators.js";
import { postComment } from "../controllers/comments.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    msg: "Welcome to the petflex api! main routes are: /users, /posts, / ",
  });
});

//get user from auth header
router.post("/login", userValidation, validate, login);

router.post(
  "/comments",
  auth,
  makeStringValidator("content", { min: 3, max: 200 }),
  validate,
  postComment
);

export default router;
