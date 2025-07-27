import mongoose, { Types } from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    content: { type: String, require: true },
    complete: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subTodo: [
      {
        id: { type: mongoose.Types.ObjectId },
        ref: "subTodo",
      },
    ],
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
