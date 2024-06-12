import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import Product from "@/lib/models/product";

// get product details api
export const GET = async (request: Request, context: { params: any }) => {
  try {
    const productId = context.params.productId;

    // check if the productId exist and is valid
    if (!productId || !Types.ObjectId.isValid(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing productId!" }),
        { status: 400 }
      );
    }

    // establish the database connection
    await connect();

    // get product details from productId
    const product = await Product.findById(productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({
          message: "Product does not exist!",
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Product Details fetched successfully!",
        data: product,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching product " + err, {
      status: 500,
    });
  }
};
