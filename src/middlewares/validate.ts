import express from "express";
import {
  Result,
  ValidationError,
  validationResult,
} from "express-validator";

export default function validate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let errors: Result<ValidationError> | ValidationError[] =
    validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({
        msg: "field validation error",
        errors: errors.array(),
      });
  } else {
    next();
  }
}
