import express from "express";
import { register } from "../controllers/users.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "hey!!" });
});

router.post("/users", register);

export default router;
