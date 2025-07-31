import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "password must be geter then 6 characters"],
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_SECRET_TIME,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_SECRET_TIME,
    }
  );
};

export const User = mongoose.model("User", userSchema);
