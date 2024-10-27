import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import indexRouter from "./routes/index.js";
import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";
import commentsRouter from "./routes/comments.js";
import cors from "cors";
import error_handler from "./middlewares/error_handler.js";
import helmet from "helmet";
import limit from "express-rate-limit";
const app = express();
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
    referrerPolicy: true,
    xDnsPrefetchControl: false,
    xXssProtection: false,
  })
);
app.use(
  limit({
    windowMs: 1000 * 60 * 1,
    limit: 30,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.DB_LINK!)
  .catch((err) => console.log(err));

app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);

app.use(error_handler);

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production")
    console.log(`App running on http://localhost:${PORT}/`);
});
