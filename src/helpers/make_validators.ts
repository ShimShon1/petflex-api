import { body } from "express-validator";

export function makeStringValidator(
  field: string,
  length?: { min: number; max: number }
) {
  const middleware = body(field)
    .isString()
    .withMessage(`${field} must be a string`)
    .trim();

  if (!length) return middleware;
  //if length provided
  return middleware
    .isLength({ min: length.min, max: length.max })
    .withMessage(
      `${field} must contain between ${length.min} and ${length.max} characters`
    );
}
