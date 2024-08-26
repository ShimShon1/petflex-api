import mongoose from "mongoose";
import Comment from "../models/Comment.js";

export default async function fetchReplies(
  commentId: mongoose.Types.ObjectId
) {
  //find all replies to the comment
  const replies = await Comment.find({
    parentId: commentId,
  }).populate("user", "username");

  if (!replies.length) {
    return [];
  }
  //create an  array, to hold replies
  const repliesWithNestedReplies = [];

  //loop over all child replies found
  for (const reply of replies) {
    const replyObject: any = reply.toObject();
    if (replyObject.hasReplies) {
      //recall the function again, retreving all replies for every reply
      replyObject.replies = await fetchReplies(reply._id);
    } else {
      replyObject.replies = [];
    }
    //push them into the intial array
    repliesWithNestedReplies.push(replyObject);
  }
  //return the array, ending the recursion
  return repliesWithNestedReplies;
}
