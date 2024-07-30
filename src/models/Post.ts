import mongoose, { Types } from "mongoose";
import { genders, petTypes } from "../types.js";

const commentSchema = new mongoose.Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  comment: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 1000,
  },
  replies: [{ type: Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, required: true, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, minLength: 3, maxLength: 30 },
  description: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 5000,
  },
  image: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 1200,
  },
  gender: {
    type: String,
    required: true,
    enum: genders,
  },
  birthDate: { type: Date, required: true },
  petType: {
    type: String,
    required: true,
    enum: petTypes,
  },
  comments: [commentSchema],
  likes: [{ type: Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, required: true, default: Date.now },
});

PostSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

PostSchema.virtual("age").get(function () {
  const now = new Date();
  const then = this.birthDate as Date;

  let years = now.getFullYear() - then.getFullYear();
  let months = now.getMonth() - then.getMonth();
  let days = now.getDate() - then.getDate();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  return { years, months, days };
});

PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

export default mongoose.model("Post", PostSchema);
