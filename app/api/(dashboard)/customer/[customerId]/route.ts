import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Customer from "@/lib/models/customer";
import { Types } from "mongoose";

// get customer details api
export const GET = async (request: Request, context: { params: any }) => {
  try {
    const customerId = context.params.customerId;

    // check if the customerId exist and is valid
    if (!customerId || !Types.ObjectId.isValid(customerId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing customerId!" }),
        { status: 400 }
      );
    }

    // establish the database connection
    await connect();

    // get customer details from customerId
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return new NextResponse(
        JSON.stringify({
          message: "Customer does not exist!",
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Customer Details fetched successfully!",
        data: customer,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching customer " + err, {
      status: 500,
    });
  }
};
