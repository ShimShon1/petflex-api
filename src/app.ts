import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
const app = express();
console.log(
  mongoose
    .connect(process.env.DB_LINK!)
    .catch((err) => console.log(err))
);

app.get("/", (req, res) => {
  res.json({ msg: "hey!!" });
});
app.listen(3000);
