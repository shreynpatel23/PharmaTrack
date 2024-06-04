import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["SALES", "PURCHASE"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "PENDING", "SOLD"],
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model("Order", OrderSchema);
export default Order;
