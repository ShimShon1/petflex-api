import express from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types.js";
export default async function auth(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token === undefined) {
    return res.status(400).json({
      errors: [{ msg: "no token provided or has no bearer" }],
    });
  } else {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET!);
      if (verified) {
        req.context = { user: verified };
        next();
      }
    } catch (error) {
      const msg = "token error: " + (error as Error).message;
      return res.status(400).json({ errors: [{ msg }] });
    }
  }
}
