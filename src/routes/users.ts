import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  changeUsername,
  getUser,
  login,
  register,
} from "../controllers/users.js";
import {
  usernameValid,
  userValidation,
} from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";
import { userLimiter } from "../middlewares/limiters.js";

const router = Router();

router.get("/", auth, getUser);

router.post(
  "/",
  userLimiter,
  userValidation,
  validate,
  register,
  login
);

router.put("/self", auth, usernameValid, validate, changeUsername);

export default router;
