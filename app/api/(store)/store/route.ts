import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Store from "@/lib/models/store";
import { Types } from "mongoose";
import User from "@/lib/models/user";

export const GET = async () => {
  try {
    // establish the connection with database
    await connect();

    // get all the stores present in the database
    const stores = await Store.find();

    // return them to frontend
    return new NextResponse(
      JSON.stringify({ message: "Stores fetched successfully!", data: stores }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching all stores " + err, {
      status: 500,
    });
  }
};

// create new store
export const POST = async (request: Request) => {
  try {
    // extract the user id from the search params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // check if the userId exist and is valid
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId!" }),
        { status: 400 }
      );
    }

    // establish the database connection
    await connect();

    // check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist!" }),
        { status: 400 }
      );
    }

    // check if the user is already registered in a store or not
    if (user.store) {
      return new NextResponse(
        JSON.stringify({ message: "User already has a store!" }),
        { status: 400 }
      );
    }

    // extract the request body from request
    const { name, location } = await request.json();

    // create the new store object
    const newStore = new Store({ name, location, netProfit: 0 });
    await newStore.save();

    // update the users table with the new store id
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        store: new Types.ObjectId(newStore._id),
      },
      {
        new: true,
      }
    );

    // check if the process successed
    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not updated!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Store created successfully!",
        data: newStore,
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating store " + err, { status: 500 });
  }
};

// update store api
export const PUT = async (request: Request) => {
  try {
    // extract the fields from the request object
    const { storeId, name, location } = await request.json();

    // establish the connection with database
    await connect();

    // check if the productId is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
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

    // update the store
    const updatedStore = await Store.findOneAndUpdate(
      { _id: store._id },
      {
        name,
        location,
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

    return new NextResponse(
      JSON.stringify({
        message: "Store updated successfully!",
        data: updatedStore,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in updating store " + err, {
      status: 500,
    });
  }
};

// delete store api
export const DELETE = async (request: Request) => {
  try {
    // extract the fields from the request object
    const { storeId } = await request.json();

    // establish the connection with database
    await connect();

    // check if the storeId is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
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

    const deleteStore = await Store.findByIdAndDelete({
      _id: store._id,
    });

    // check if the process successed
    if (!deleteStore) {
      return new NextResponse(
        JSON.stringify({ message: "Store not deleted!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: `Store, ${store.name} has been deleted successfully!`,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in deleting store " + err, {
      status: 500,
    });
  }
};
