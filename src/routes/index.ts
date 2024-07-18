import express from "express";
import { login, register } from "../controllers/users.js";
import { body } from "express-validator";
import { userValidation } from "../helpers/validations.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Welcome to petflex!" });
});

router.post("/users", userValidation, validate, register);

router.post("/login", userValidation, validate, login);

export default router;
