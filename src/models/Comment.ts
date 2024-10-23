import mongoose, { Types } from "mongoose";

export const CommentSchema = new mongoose.Schema({
  postId: {
    type: Types.ObjectId,
    ref: "Post",
    required: true,
  },

  parentId: {
    type: Types.ObjectId || null,
    ref: "Comment",
    default: null,
  },
  hasReplies: { type: Boolean, default: false },
  available: { type: Boolean, default: true, required: true },
  user: { type: Types.ObjectId, ref: "User", required: true },
  content: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 1000,
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

CommentSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.model("Comment", CommentSchema);
