import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Product from "@/lib/models/product";
import { Types } from "mongoose";
import Store from "@/lib/models/store";

export const GET = async () => {
  try {
    // establish a connection with database
    await connect();

    // extract all the available products
    const products = await Product.find().populate({
      path: "supplier",
      select: ["_id", "firstName", "lastName", "location"],
    });

    // send them to the frontend
    return new NextResponse(
      JSON.stringify({
        message: "Products fetched successfully!",
        data: products,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching products " + err, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
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

    // extract the values frem the request object
    const { productName, drugCode, strength, price, supplierId } =
      await request.json();

    // create the new product object
    const newProduct = new Product({
      productName,
      drugCode,
      strength,
      price,
      quantity: 0,
      supplier: new Types.ObjectId(supplierId),
      store: new Types.ObjectId(storeId),
    });

    // save the info in the dabatabse
    await newProduct.save();

    // send the confirmation to frontend
    return new NextResponse(
      JSON.stringify({
        message: "Product created successfully!",
        data: newProduct,
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating product " + err, {
      status: 500,
    });
  }
};
