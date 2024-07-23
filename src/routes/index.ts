import express from "express";
import { getUser, login, register } from "../controllers/users.js";
import { body } from "express-validator";
import { userValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import { UserRequest } from "../types.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Welcome to petflex!" });
});

router.post("/users", userValidation, validate, register);

router.get("/users", auth, getUser);

router.post("/auth/login", userValidation, validate, login);

export default router;
