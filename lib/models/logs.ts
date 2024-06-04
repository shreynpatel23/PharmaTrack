import { Schema, model, models } from "mongoose";

const LogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

const Log = models.Log || model("Log", LogSchema);
export default Log;
