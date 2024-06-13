import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import Store from "@/lib/models/store";
import Role from "@/lib/models/role";

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

    // get all the roles as well to avoid the MissingSchemaError
    await Role.find({});

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
    return new NextResponse("Error in fetching users " + err, { status: 500 });
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

    // encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

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
    return new NextResponse("Error in creating users " + err, { status: 500 });
  }
};

// update user api
export const PUT = async (request: Request) => {
  try {
    // extract the fields from the request object
    const {
      userId,
      firstName,
      lastName,
      phoneNumber,
      email,
      status,
      roleId,
      storeId,
    } = await request.json();

    // check if the storeId exist and is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
        { status: 400 }
      );
    }

    // establish the connection with database
    await connect();

    // check if the store exists
    const store = Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // check if the userId is valid
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId!" }),
        { status: 400 }
      );
    }

    // check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist!" }),
        { status: 400 }
      );
    }

    // check if the user belongs to this store or not
    if (String(user.store) !== String(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "User does not belong to this store!" }),
        { status: 400 }
      );
    }

    // update the product
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        firstName,
        lastName,
        phoneNumber,
        email,
        status,
        role: new Types.ObjectId(roleId),
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
        message: "User updated successfully!",
        data: updatedUser,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in updating user " + err, {
      status: 500,
    });
  }
};

// delete user api
export const DELETE = async (request: Request) => {
  try {
    // extract the fields from the request object
    const { userId, storeId } = await request.json();

    // check if the storeId exist and is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
        { status: 400 }
      );
    }

    // establish the connection with database
    await connect();

    // check if the store exists
    const store = Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // check if the userId is valid
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId!" }),
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

    // check if the user belongs to this store or not
    if (String(user.store) !== String(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "User does not belong to this store!" }),
        { status: 400 }
      );
    }

    const deleteUser = await User.findByIdAndDelete({
      _id: user._id,
    });

    // check if the process successed
    if (!deleteUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not deleted!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: `${user.firstName} ${user.lastName} has been deleted successfully!`,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in deleting user " + err, {
      status: 500,
    });
  }
};
