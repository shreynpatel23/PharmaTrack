import { Schema, model, models } from "mongoose";

const StoreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    netProfit: {
      type: Number,
    },
    location: {
      type: {
        addressLine1: String,
        addressLine2: String,
        postalCode: String,
        city: String,
        province: String,
        country: String,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Store = models.Store || model("Store", StoreSchema);

export default Store;
