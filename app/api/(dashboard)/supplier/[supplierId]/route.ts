import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import Product from "@/lib/models/product";
import Supplier from "@/lib/models/supplier";

// get supplier details api
export const GET = async (request: Request, context: { params: any }) => {
  try {
    const supplierId = context.params.supplierId;

    // check if the supplierId exist and is valid
    if (!supplierId || !Types.ObjectId.isValid(supplierId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing supplierId!" }),
        { status: 400 }
      );
    }

    // establish the database connection
    await connect();

    // get supplier details from supplierId
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return new NextResponse(
        JSON.stringify({
          message: "Supplier does not exist!",
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Supplier Details fetched successfully!",
        data: supplier,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching supplier " + err, {
      status: 500,
    });
  }
};
