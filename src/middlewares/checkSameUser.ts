import { UserRequest } from "../types.js";
import express from "express";
//check if the creator of the current post and the logged user are the same
export default async function checkSameUser(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.context.post.user.toString() === req.context.user._id) {
    next();
  } else {
    return res
      .status(401)
      .json({ errors: [{ msg: "incorrect user, not owner" }] });
  }
}
