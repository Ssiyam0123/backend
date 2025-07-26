import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      lowerCase: true,
    },
    password: {
      type: String,
      require: true,
      min: [6, "password must be least six characters."],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
