import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    token: {
      type: String,
      trim: true,
    },
  },
  { collection: "users_list" }
);

export default mongoose.model("User", UserSchema);
