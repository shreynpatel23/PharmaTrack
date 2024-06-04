import { NextResponse } from "next/server";
import { Types } from "mongoose";

// lib
import connect from "@/lib/db";

// models
import Store from "@/lib/models/store";
import Product from "@/lib/models/product";
import User from "@/lib/models/user";
import Order from "@/lib/models/order";

// get all orders for a store api routes
export const GET = async (request: Request) => {
  try {
    // extract the store id from the search params
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    // check if the storeId exist and is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
        { status: 400 }
      );
    }

    // establish a connection with database
    await connect();

    // check if the store exists in the database
    const store = await Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // load the product to avoid MissingSchemaError
    await Product.find({});
    // load the user collection to avoid MissingSchemaError
    await User.find({});

    // extract all the available orders
    const orders = await Order.find({
      store: new Types.ObjectId(storeId),
    })
      .populate({ path: "store", select: ["_id", "name"] })
      .populate({ path: "createdBy", select: ["_id", "firstName", "lastName"] })
      .populate({ path: "product", select: ["_id", "productName"] })
      .exec();

    // send them to the frontend
    return new NextResponse(
      JSON.stringify({
        message: "Orders fetched successfully!",
        data: orders,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching orders " + err, {
      status: 500,
    });
  }
};

// delete order
export const DELETE = async (request: Request) => {
  try {
    // extract the values frem the request object
    const { orderId, storeId } = await request.json();

    // check if the orderId exist and is valid
    if (!orderId || !Types.ObjectId.isValid(orderId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing orderId!" }),
        { status: 400 }
      );
    }

    // check if the storeId exist and is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
        { status: 400 }
      );
    }

    // establish the connection with database
    await connect();

    // check if the order exists in the database
    const order = await Order.findById(orderId);
    if (!order) {
      return new NextResponse(
        JSON.stringify({ message: "Order does not exist!" }),
        { status: 400 }
      );
    }

    // check if the store exists in the database
    const store = await Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // check if the order is in this store or not
    if (String(order.store) !== storeId) {
      return new NextResponse(
        JSON.stringify({ message: "Order does not belong to this store!" }),
        { status: 400 }
      );
    }

    const deleteOrder = await Order.findByIdAndDelete({
      _id: order._id,
    });

    // check if the process successed
    if (!deleteOrder) {
      return new NextResponse(
        JSON.stringify({ message: "Order not deleted!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: `Order has been deleted successfully!`,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in deleting order " + err, {
      status: 500,
    });
  }
};
