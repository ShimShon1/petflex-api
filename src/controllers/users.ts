import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
export function register(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log(req.body);
  const password = bcrypt.hashSync(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    password: password,
  });
  newUser.save();
  res.json({ newUser });
  return;
}
