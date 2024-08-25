import mongoose from "mongoose";
import Comment from "../models/Comment.js";

export default async function fetchReplies(
  commentId: mongoose.Types.ObjectId
) {
  const replies = await Comment.find({
    parentId: commentId,
  }).populate("user", "username");
  const repliesWithNestedReplies = [];

  for (const reply of replies) {
    const replyObject: any = reply.toObject();
    replyObject.replies = await fetchReplies(reply._id);
    repliesWithNestedReplies.push(replyObject);
  }

  return repliesWithNestedReplies;
}
