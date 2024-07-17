import express from "express";
import { register } from "../controllers/users.js";
import { body } from "express-validator";
import { userValidation } from "../helpers/validations.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "hey!!" });
});

router.post("/users", userValidation, register);

export default router;
