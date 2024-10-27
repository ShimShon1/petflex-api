import { MulterError } from "multer";
import express from "express";
//simple err handler, so far for multer
export default (
  err: MulterError | Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  return res.status(500).json({
    errors: [{ msg: err.message || "there was an error" }],
  });
};
