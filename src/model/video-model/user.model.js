import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      index : true
    },
    email: {
      type: String,
      required: [true, "please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      trype: String,
      required: true,
    },
    watchList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken : {
        type : String
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.password.isModified) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model("User", userSchema);
