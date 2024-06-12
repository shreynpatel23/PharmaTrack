import { NextResponse } from "next/server";
import connect from "@/lib/db";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import User from "@/lib/models/user";
import Role from "@/lib/models/role";
import { cookies } from "next/headers";

export const POST = async (request: Request) => {
  try {
    // extract email and password from the request body
    const { email, password } = await request.json();

    // establish the connection with database
    await connect();

    // get all the roles as well to avoid the MissingSchemaError
    await Role.find({});

    // check if the user exists in the database
    const selectedUser = await User.findOne({ email }).populate({
      path: "role",
      select: ["_id", "name"],
    });

    if (!selectedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist!" }),
        { status: 400 }
      );
    }

    // check if the password hash matches or not
    if (!bcrypt.compareSync(password, selectedUser.password))
      return new NextResponse(
        JSON.stringify({ message: "Email or password is incorrect" }),
        { status: 400 }
      );

    // create a jwt token and send it as a resppnse
    const token = jwt.sign(
      { selectedUser },
      process.env.TOKEN_SECRET || "sign"
    );

    const response = { ...selectedUser?._doc, token };

    cookies().set({
      name: "userData",
      value: JSON.stringify(response),
      httpOnly: true,
      path: "/",
    });

    return new NextResponse(
      JSON.stringify({
        message: "User fetched successfully!",
        data: response,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in login " + err, { status: 500 });
  }
};
