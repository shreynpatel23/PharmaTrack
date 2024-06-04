import { NextResponse } from "next/server";
import { Types } from "mongoose";

// utils
import connect from "@/lib/db";
import { TYPE, STATUS } from "@/constants/Order";

// models
import Store from "@/lib/models/store";
import Product from "@/lib/models/product";
import Supplier from "@/lib/models/supplier";
import Order from "@/lib/models/order";
import User from "@/lib/models/user";

// create purchase order api
export const POST = async (request: Request) => {
  try {
    // extract the values frem the request object
    const { productId, quantity, supplierId, storeId, userId } =
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

    // check if the supplierId exist and is valid
    if (!supplierId || !Types.ObjectId.isValid(supplierId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing supplierId!" }),
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

    // check if the supplier exists in the database
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier does not exist!" }),
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

    // check if the supplier is selling that product or not
    if (String(product.supplier) !== supplierId) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Supplier does not sell this product. Please check your supplier!",
        }),
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

    // create the new order object
    const newOrder = new Order({
      quantity,
      amount: quantity * product.price,
      type: TYPE.PURCHASE,
      status: STATUS.PENDING,
      product: new Types.ObjectId(productId),
      supplier: new Types.ObjectId(supplierId),
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

// update purchase order api
export const PUT = async (request: Request) => {
  try {
    // extract the values frem the request object
    const { orderId, productId, quantity } = await request.json();

    // check if the orderId exist and is valid
    if (!orderId || !Types.ObjectId.isValid(orderId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing orderId!" }),
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

    // check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not exist!" }),
        { status: 400 }
      );
    }

    // check if the order made was for this product or not
    if (String(order.product) !== productId) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not belong to this order!" }),
        { status: 400 }
      );
    }

    // update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id },
      {
        quantity,
        amount: quantity * product.price,
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

    return new NextResponse(
      JSON.stringify({
        message: "Order updated successfully!",
        data: updatedOrder,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in updating order " + err, {
      status: 500,
    });
  }
};
