import mongoose, { Types } from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
});

const PostSchema = new mongoose.Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: String, required: true },
  petType: { type: String },
  comments: [commentSchema],
  likes: [{ type: Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Post", PostSchema);
