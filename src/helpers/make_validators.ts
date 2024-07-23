import { body } from "express-validator";

export function makeStringValidator(
  name: string,
  length: { min: number; max: number }
) {
  return body(name)
    .isString()
    .trim()
    .isLength({ min: length.min, max: length.max })
    .withMessage(
      `${name} must contain between ${length.min} and ${length.max} characters`
    );
}
