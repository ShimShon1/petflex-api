import { Router } from "express";
import auth from "../middlewares/auth.js";
import { getUser, login, register } from "../controllers/users.js";
import { userValidation } from "../middlewares/validations.js";
import validate from "../middlewares/validate.js";

const router = Router();

router.get("/", auth, getUser);

router.post("/", userValidation, validate, register, login);

export default router;
