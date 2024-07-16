import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/User.js";
const app = express();
mongoose
  .connect(process.env.DB_LINK!)
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json({ msg: "hey!!" });
});

app.listen(3000);
