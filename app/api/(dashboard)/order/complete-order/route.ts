import { NextResponse } from "next/server";
import { Types } from "mongoose";

// utils
import connect from "@/lib/db";
import { STATUS } from "@/constants/Order";

// models
import Product from "@/lib/models/product";
import Order from "@/lib/models/order";

// complete order
export const POST = async (request: Request) => {
  try {
    // extract the values frem the request object
    const { orderId } = await request.json();

    // check if the orderId exist and is valid
    if (!orderId || !Types.ObjectId.isValid(orderId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing orderId!" }),
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

    // check if the order is already completed or not
    if (order.status.toLowerCase() === STATUS.COMPLETED.toLowerCase()) {
      return new NextResponse(
        JSON.stringify({ message: "Order is already completed!" }),
        { status: 400 }
      );
    }

    // extract the product information and update the quantity of it
    const product = await Product.findById(order.product);

    // check if the present in the database
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not exist!" }),
        { status: 400 }
      );
    }

    // update the quantity of the product as per the quantity of the order
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      {
        quantity: product.quantity + order.quantity,
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

    // update the order database with the updated status
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id },
      {
        status: STATUS.COMPLETED,
      },
      {
        new: true,
      }
    );

    // check if the process successed
    if (!updatedOrder) {
      return new NextResponse(
        JSON.stringify({ message: "Order not updated!" }),
        { status: 400 }
      );
    }

    // send the confirmation to frontend
    return new NextResponse(
      JSON.stringify({
        message: "Order completed successfully!",
        data: updatedOrder,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in completing order " + err, {
      status: 500,
    });
  }
};
