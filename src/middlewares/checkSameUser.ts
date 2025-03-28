import { UserRequest } from "../types.js";
import express from "express";
//check if the creator of the current post and the logged user are the same
export default async function checkSameUser(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const loggedUserId = req.context.user._id;
  if (
    req.context.post.user.toString() === loggedUserId ||
    req.context.post.user._id.toString() === loggedUserId ||
    process.env.ADMINS?.split(",").includes(
      req.context.user._id.toString()
    )
  ) {
    next();
  } else {
    return res
      .status(401)
      .json({ errors: [{ msg: "incorrect user, not owner" }] });
  }
}
