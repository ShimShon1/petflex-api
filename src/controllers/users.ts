import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
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

export async function login() {}
