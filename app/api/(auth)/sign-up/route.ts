import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Role from "@/lib/models/role";
import { Types } from "mongoose";

export const POST = async (request: Request) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } =
      await request.json();

    // encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // establish the connection with database
    await connect();

    // get all roles and assign an owner role to this user
    const roles = await Role.find({ name: "Owner" });

    // create the new user object
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      status: true,
      role: new Types.ObjectId(roles[0]?._id),
    });
    await newUser.save();

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
