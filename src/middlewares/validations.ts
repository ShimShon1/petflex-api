import { body } from "express-validator";
import { makeStringValidator } from "../helpers/make_validators.js";

const usernameValid = makeStringValidator("username", {
  min: 3,
  max: 20,
});

const passwordValid = makeStringValidator("password", {
  min: 5,
  max: 20,
});

//for posts (mainly)
const nameValid = body("name")
  .isString()
  .trim()
  .isLength({ min: 5, max: 20 })
  .withMessage("name must be between 3 and 20");

export const userValidation = [usernameValid, passwordValid];

export const postValidation = [nameValid];
