import { MulterError } from "multer";
import express from "express";
//simple err handler, so far for multer
export default (
  err: MulterError | Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //if multer error, return custom message, otherwise just 500
  try {
    console.log("error handling!");
    if (err instanceof MulterError) {
      console.log(err);
      const status = err.storageErrors.length
        ? err.storageErrors[0]["http_code"]
        : 400;

      return res.status(status).json({
        errors: [{ msg: err.message || "there was an error" }],
      });
    }

    return res.status(500).json({
      errors: [{ msg: err.message || "there was an error" }],
    });
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: "there was an error" }],
    });
  }
};
