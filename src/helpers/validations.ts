import { body } from "express-validator";

const usernameValidation = body("username")
  .trim()
  .isLength({ min: 5, max: 20 })
  .withMessage("username must be between 5 and 20");

const passwordValidation = body("password")
  .trim()
  .isLength({ min: 5, max: 20 })
  .withMessage("password must be between 5 and 20");

export const userValidation = [
  usernameValidation,
  passwordValidation,
];
