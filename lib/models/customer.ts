import { Schema, model, models } from "mongoose";

const CustomerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
  },
  {
    timestamps: true,
  }
);

const Customer = models.Customer || model("Customer", CustomerSchema);

export default Customer;
