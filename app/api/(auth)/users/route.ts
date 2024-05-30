import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();

    return new NextResponse(
      JSON.stringify({ message: "Users fetched successfully!", data: users }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching users" + err, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
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
