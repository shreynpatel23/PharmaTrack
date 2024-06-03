import { NextResponse } from "next/server";
import connect from "@/lib/db";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import User from "@/lib/models/user";

export const POST = async (request: Request) => {
  try {
    // extract email and password from the request body
    const { email, password } = await request.json();

    // establish the connection with database
    await connect();

    // check if the user exists in the database
    const selectedUser = await User.findOne({ email });

    if (!selectedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist!" }),
        { status: 404 }
      );
    }

    // check if the password hash matches or not
    if (!bcrypt.compareSync(password, selectedUser.password))
      return new NextResponse(
        JSON.stringify({ message: "Email or password is incorrect" })
      );

    // create a jwt token and send it as a resppnse
    const token = jwt.sign({ email }, process.env.TOKEN_SECRET || "");

    return new NextResponse(
      JSON.stringify({
        message: "User fetched successfully!",
        data: { ...selectedUser?._doc, token },
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in login " + err, { status: 500 });
  }
};
