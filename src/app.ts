import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import indexRouter from "./routes/index.js";
import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";
import cors from "cors";
import error_handler from "./middlewares/error_handler.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose
  .connect(process.env.DB_LINK!)
  .catch((err) => console.log(err));

app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);

app.use(error_handler);

app.listen(3000);
