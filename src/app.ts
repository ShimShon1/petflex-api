import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import indexRouter from "./routes/index.js";
import postsRouter from "./routes/posts.js";

import auth from "./middlewares/auth.js";
import { UserRequest } from "./types.js";
import { getPosts, postPosts } from "./controllers/posts.js";
const app = express();
app.use(express.json());
mongoose
  .connect(process.env.DB_LINK!)
  .catch((err) => console.log(err));

app.use("/", indexRouter);
app.use("/posts", postsRouter);

// app.get("/protected", auth, function (req: UserRequest, res) {
//   console.log(req.context);
//   res.json({
//     msg:
//       "you are in the protected Route! " + req.context.user.username,
//   });
// });

app.listen(3000);
