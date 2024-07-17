import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import indexRouter from "./routes/index.js";
const app = express();
app.use(express.json());
mongoose
  .connect(process.env.DB_LINK!)
  .catch((err) => console.log(err));

app.use("/", indexRouter);

app.listen(3000);
