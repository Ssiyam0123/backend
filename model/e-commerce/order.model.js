import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      types: mongoose.Schema.Types.ObjectId,
      ref: "Proudct",
    },
    quantity: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      types: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderedProduct: [orderItemSchema],
    address: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      enum: ["PENDDING", "CANCELED", "DELEVIRED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
