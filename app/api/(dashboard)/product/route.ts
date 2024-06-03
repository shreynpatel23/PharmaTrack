import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Product from "@/lib/models/product";
import { Types } from "mongoose";
import Store from "@/lib/models/store";
import Supplier from "@/lib/models/supplier";

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

export const PUT = async (request: Request) => {
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

    // extract the fields from the request object
    const { productId, supplierId, productName, drugCode, strength, price } =
      await request.json();

    // establish the connection with database
    await connect();

    // check if the productId is valid
    if (!productId || !Types.ObjectId.isValid(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing productId!" }),
        { status: 400 }
      );
    }

    // check if the supplier exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not exist!" }),
        { status: 400 }
      );
    }

    // check if the supplierId is valid
    if (!supplierId || !Types.ObjectId.isValid(supplierId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing supplierId!" }),
        { status: 400 }
      );
    }

    // check if the supplier exists in the database
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier does not exist!" }),
        { status: 400 }
      );
    }

    // check if the product belongs to this store or not
    if (String(product.store) !== String(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not belong to this store!" }),
        { status: 400 }
      );
    }

    // update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      {
        productName,
        drugCode,
        strength,
        price,
        supplier: new Types.ObjectId(supplierId),
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

    return new NextResponse(
      JSON.stringify({
        message: "Product updated successfully!",
        data: updatedProduct,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in updating supplier " + err, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
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

    // extract the fields from the request object
    const { productId } = await request.json();

    // check if the productId is valid
    if (!productId || !Types.ObjectId.isValid(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing productId!" }),
        { status: 400 }
      );
    }

    // establish the connection with database
    await connect();

    // check if the supplier exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not exist!" }),
        { status: 400 }
      );
    }

    // check if the product belongs to this store or not
    if (String(product.store) !== String(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not belong to this store!" }),
        { status: 400 }
      );
    }

    const deleteProduct = await Product.findByIdAndDelete({
      _id: product._id,
    });

    // check if the process successed
    if (!deleteProduct) {
      return new NextResponse(
        JSON.stringify({ message: "Product not deleted!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: `${product.productName} has been deleted successfully!`,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in deleting product " + err, {
      status: 500,
    });
  }
};
