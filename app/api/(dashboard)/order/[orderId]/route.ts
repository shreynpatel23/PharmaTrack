import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import Order from "@/lib/models/order";

// get order details api
export const GET = async (request: Request, context: { params: any }) => {
  try {
    const orderId = context.params.orderId;

    // check if the orderId exist and is valid
    if (!orderId || !Types.ObjectId.isValid(orderId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing orderId!" }),
        { status: 400 }
      );
    }

    // establish the database connection
    await connect();

    // get order details from orderId
    const order = await Order.findById(orderId);

    if (!order) {
      return new NextResponse(
        JSON.stringify({
          message: "Order does not exist!",
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Order Details fetched successfully!",
        data: order,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching order " + err, {
      status: 500,
    });
  }
};
