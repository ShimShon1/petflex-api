import express from "express";
import { getUser, login, register } from "../controllers/users.js";
import { userValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    msg: "Welcome to the petflex api! main routes are: /users, /posts, / ",
  });
});

router.post("/users", userValidation, validate, register);

router.get("/users", auth, getUser);

router.post("/auth/login", userValidation, validate, login);

export default router;
