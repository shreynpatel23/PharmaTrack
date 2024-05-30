import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import Store from "@/lib/models/store";

// get all users for a store id
export const GET = async (request: Request) => {
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

    // establish the database connection
    await connect();

    // check if the store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // fetch all the users where storeId is equal to params store id
    const users = await User.find({
      store: new Types.ObjectId(storeId),
    })
      .populate({ path: "role", select: ["_id", "name"] })
      .populate({ path: "store", select: ["_id", "name"] })
      .exec();
    return new NextResponse(
      JSON.stringify({ message: "Users fetched successfully!", data: users }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching users" + err, { status: 500 });
  }
};

// add a new user for a store
export const POST = async (request: Request) => {
  try {
    // extract the fields from request body
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      roleId,
      storeId,
    } = await request.json();

    // encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // establish the connection with database
    await connect();

    // create the new user object
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      status: true,
      role: new Types.ObjectId(roleId),
      store: new Types.ObjectId(storeId),
    });
    // save it in the database
    await newUser.save();

    // return the success response
    return new NextResponse(
      JSON.stringify({ message: "User created successfully!", data: newUser }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating users" + err, { status: 500 });
  }
};
