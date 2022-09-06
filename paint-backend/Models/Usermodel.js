import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
