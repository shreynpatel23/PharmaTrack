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
