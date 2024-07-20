import { body } from "express-validator";

const usernameValidation = body("username")
  .isString()
  .trim()
  .isLength({ min: 3, max: 20 })
  .withMessage("username must be between 3 and 20");

const passwordValidation = body("password")
  .isString()
  .trim()
  .isLength({ min: 5, max: 20 })
  .withMessage("password must be between 3 and 20");

export const userValidation = [
  usernameValidation,
  passwordValidation,
];
