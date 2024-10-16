import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 500,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
