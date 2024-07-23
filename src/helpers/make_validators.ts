import { body } from "express-validator";

export function makeStringValidator(
  name: string,
  length?: { min: number; max: number }
) {
  const middleware = body(name)
    .isString()
    .withMessage(`${name} must be a string`)
    .trim();

  if (!length) return middleware;
  //if length provided
  return middleware
    .isLength({ min: length.min, max: length.max })
    .withMessage(
      `${name} must contain between ${length.min} and ${length.max} characters`
    );
}
