import { NextResponse } from "next/server";
import { Types } from "mongoose";

// utils
import connect from "@/lib/db";
import { TYPE, STATUS } from "@/constants/Order";

// models
import Store from "@/lib/models/store";
import Product from "@/lib/models/product";
import Customer from "@/lib/models/customer";
import Order from "@/lib/models/order";
import User from "@/lib/models/user";

// create sales order api
export const POST = async (request: Request) => {
  try {
    // extract the values frem the request object
    const { productId, quantity, customerId, storeId, userId } =
      await request.json();

    // check if the storeId exist and is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
        { status: 400 }
      );
    }

    // check if the productId exist and is valid
    if (!productId || !Types.ObjectId.isValid(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing productId!" }),
        { status: 400 }
      );
    }

    // check if the customerId exist and is valid
    if (!customerId || !Types.ObjectId.isValid(customerId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing customerId!" }),
        { status: 400 }
      );
    }

    // check if the userId exist and is valid
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId!" }),
        { status: 400 }
      );
    }

    // establish the connection with database
    await connect();

    // check if the store exists in the database
    const store = await Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not exist!" }),
        { status: 400 }
      );
    }

    // check if the customer exists in the database
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return new NextResponse(
        JSON.stringify({ message: "Customer does not exist!" }),
        { status: 400 }
      );
    }

    // check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist!" }),
        { status: 400 }
      );
    }

    // check if the product is in store or not
    if (String(product.store) !== String(storeId)) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Product not present in the store. Please add a product first!",
        }),
        { status: 400 }
      );
    }

    // check if the user is present in the store
    if (String(user.store) !== String(storeId)) {
      return new NextResponse(
        JSON.stringify({
          message: "User does not belong to this store!",
        }),
        { status: 400 }
      );
    }

    // check if the customer is present in the store
    if (String(customer.store) !== String(storeId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Customer does not belong to this store!",
        }),
        { status: 400 }
      );
    }

    // check if the number of item selling is less than the current stock
    if (quantity > product.quantity) {
      return new NextResponse(
        JSON.stringify({
          message: `The quantity entered exceeds the available stock. Please enter a quantity less than or equal to the current stock level.`,
        }),
        { status: 400 }
      );
    }

    // get the total order total here
    const totalOrderAmount = quantity * product.price;

    // update the quantity in the product table
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      {
        quantity: product.quantity - quantity,
      },
      {
        new: true,
      }
    );

    // check if the process successed
    if (!updatedProduct) {
      return new NextResponse(
        JSON.stringify({ message: "Product not updated!" }),
        { status: 400 }
      );
    }

    // update the profit column in the store table
    const updatedStore = await Store.findOneAndUpdate(
      { _id: store._id },
      {
        netProfit: store.netProfit + totalOrderAmount,
      },
      {
        new: true,
      }
    );

    // check if the process successed
    if (!updatedStore) {
      return new NextResponse(
        JSON.stringify({ message: "Store not updated!" }),
        { status: 400 }
      );
    }

    // create the new order object
    const newOrder = new Order({
      quantity,
      amount: totalOrderAmount,
      type: TYPE.SALES,
      status: STATUS.SOLD,
      product: new Types.ObjectId(productId),
      customer: new Types.ObjectId(customerId),
      store: new Types.ObjectId(storeId),
      createdBy: new Types.ObjectId(userId),
    });

    // save the info in the dabatabse
    await newOrder.save();

    // send the confirmation to frontend
    return new NextResponse(
      JSON.stringify({
        message: "Order created successfully!",
        data: newOrder,
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating order " + err, {
      status: 500,
    });
  }
};
