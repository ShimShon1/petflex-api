import mongoose, { Types } from "mongoose";
import { genders, petTypes } from "../types.js";
import calcAge from "../helpers/calcAge.js";

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
  likes: [{ type: Types.ObjectId, ref: "User" }],
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, required: true, default: Date.now },
});

PostSchema.virtual("likesCount").get(function () {
  return this.likes?.length;
});

PostSchema.virtual("age").get(function () {
  return this?.birthDate && calcAge(this.birthDate);
});

PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

export default mongoose.model("Post", PostSchema);
