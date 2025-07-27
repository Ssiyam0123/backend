import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: [true, "please provide your user name."],
    },
    email: {
      type: String,
      require: [true, " please provide your email"],
    },
    password: {
      type: String,
      require: [true],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
