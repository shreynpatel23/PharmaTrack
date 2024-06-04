import { Schema, model, models } from "mongoose";

const SupplierSchema = new Schema(
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
    location: {
      type: {
        addressLine1: String,
        addressLine2: String,
        postalCode: String,
        city: String,
        provience: String,
        country: String,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = models.Supplier || model("Supplier", SupplierSchema);
export default Supplier;
