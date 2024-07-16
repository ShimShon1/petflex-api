import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  notifications: [
    {
      message: { type: String, required: true },
      isRead: { type: Boolean, required: true },
    },
  ],
});

const User = mongoose.model("User", UserSchema);
export default User;
