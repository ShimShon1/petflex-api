import express from "express";
import { login } from "../controllers/users.js";
import { userValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    msg: "Welcome to the petflex api! main routes are: /users, /posts, /comments",
  });
});

//get user from auth header
router.post("/login", userValidation, validate, login);

export default router;
