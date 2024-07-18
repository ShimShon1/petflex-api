import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  Result,
  ValidationError,
  validationResult,
} from "express-validator";
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
    return res.json({ newUser });
  } catch (error) {
    return res.status(500).json({ msg: "There was an error" });
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
        return res.status(400).json({ msg: "Wrong password" });
      } else {
        const token = jwt.sign(
          { ...user },
          "process.env.JWT_SECRET",
          { expiresIn: "1h" }
        );
        return res.json({ user, token });
      }
    } else {
      return res.status(400).json({ msg: "Wrong username" });
    }
    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "There was an error" });
  }
}
