import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    drugCode: {
      type: String,
      required: true,
      unique: true,
    },
    strength: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
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

const Product = models.Product || model("Product", ProductSchema);
export default Product;
