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
      password,
    });
    await newUser.save();

    return next();
  } catch (error) {
    next(error);
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
      const isPassCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPassCorrect) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Wrong password" }] });
      } else {
        const { password, ...payload } = user.toObject();
        if (user.isBanned) {
          return res
            .status(401)
            .json({ errors: [{ msg: "User is banned" }] });
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET!);
        return res.status(200).json({
          token,
          user: {
            _id: user._id,
            username: user.username,
            admin: process.env.ADMINS?.split(",").includes(
              String(user._id)
            ),
          },
        });
      }
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: "Wrong username" }] });
    }
  } catch (error) {
    next(error);
  }
}

export function getUser(
  req: UserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { password, iat, exp, ...user } = req.context.user;
    if (process.env.ADMINS?.split(",").includes(user._id)) {
      user.admin = true;
    }

    delete user.__v;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
