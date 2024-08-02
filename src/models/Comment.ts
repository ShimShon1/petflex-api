import mongoose, { Types } from "mongoose";

export const CommentSchema = new mongoose.Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  content: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 1000,
  },
  replies: [{ type: Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model("Comment", CommentSchema);
