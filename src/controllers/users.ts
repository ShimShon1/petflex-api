import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types.js";
export async function register(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const userExists = await User.exists({
      username: req.body.username,
    });
    if (userExists) {
      return res.status(400).json({
        msg: "error",
        errors: [{ msg: "username is taken" }],
      });
    }
    const password = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: password,
    });
    newUser.save();
    return res.status(201).json({ newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ errors: { msg: "There was an error" } });
  }
}

export async function login(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user !== null) {
      const result = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!result) {
        return res
          .status(400)
          .json({ errors: { msg: "Wrong password" } });
      } else {
        const payload = user.toObject();
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: "12h",
        });
        return res.json({ payload, token });
      }
    } else {
      return res
        .status(400)
        .json({ errors: { msg: "Wrong username" } });
    }
    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errors: { msg: "There was an error" } });
  }
}

export function getUser(req: UserRequest, res: express.Response) {
  const { password, iat, exp, ...user } = req.context.user;
  delete user.__v;
  res.json({ user });
}
