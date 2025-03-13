import express from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types.js";
import User from "../models/User.js";
import { ObjectId } from "mongoose";
export default async function auth(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token == undefined) {
    return res.status(401).json({
      errors: [{ msg: "no token provided or has no bearer" }],
    });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: ObjectId | string;
      username: string;
    };

    if (verified && verified._id) {
      const user = await User.findOne({
        _id: verified._id,
        username: verified.username,
      });
      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: "User not found" }] });
      }
      if (user.isBanned) {
        return res
          .status(403)
          .json({ errors: [{ msg: "User is banned" }] });
      }
      req.context = { user: verified };
      next();
    }
  } catch (error) {
    const msg = "token error: " + (error as Error).message;
    return res.status(401).json({ errors: [{ msg }] });
  }
}
