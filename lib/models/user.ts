import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
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
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
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

const User = models.User || model("User", UserSchema);

export default User;
