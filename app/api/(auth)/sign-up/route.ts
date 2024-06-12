import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Role from "@/lib/models/role";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (request: Request) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } =
      await request.json();

    // encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // establish the connection with database
    await connect();

    // check if the user is already present or not
    const user = await User.findOne({ email });
    if (user) {
      return new NextResponse(
        JSON.stringify({
          message: "User already present with this email. Please try Login!",
        }),
        { status: 400 }
      );
    }

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

    // create a jwt token and send it as a resppnse
    const token = jwt.sign({ newUser }, process.env.TOKEN_SECRET || "sign");

    const response = { ...newUser?._doc, token };

    cookies().set({
      name: "userData",
      value: JSON.stringify(response),
      httpOnly: true,
      path: "/",
    });

    return new NextResponse(
      JSON.stringify({ message: "User created successfully!", data: response }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating users " + err, { status: 500 });
  }
};
