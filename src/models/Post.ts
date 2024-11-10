import mongoose, { Types } from "mongoose";
import { genders, petTypes } from "../types.js";
import calcAge from "../helpers/calcAge.js";

const PostSchema = new mongoose.Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, minLength: 3, maxLength: 20 },
  description: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 1000,
  },
  image: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 1200,
  },
  imageName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 2000,
  },
  gender: {
    type: String,
    required: true,
    enum: genders,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  petType: {
    type: String,
    required: true,
    enum: petTypes,
  },
  isDead: {
    type: Boolean,
    required: true,
    default: false,
  },
  likes: [{ type: Types.ObjectId, ref: "User" }],
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  public: { type: Boolean, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

PostSchema.virtual("age").get(function () {
  return this?.birthDate && calcAge(this.birthDate);
});

PostSchema.index({ createdAt: -1 });

PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

export default mongoose.model("Post", PostSchema);
