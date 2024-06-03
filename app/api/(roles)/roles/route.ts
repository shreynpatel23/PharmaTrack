import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Role from "@/lib/models/role";

export const GET = async () => {
  try {
    // establish a connection with database
    await connect();

    // extract all the available roles
    const roles = await Role.find();

    // send them to the frontend
    return new NextResponse(
      JSON.stringify({ message: "Roles fetched successfully!", data: roles }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching roles " + err, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const { name } = await request.json();

    // establish the connection with database
    await connect();

    // create the new role object
    const newRole = new Role({ name });

    // save the info in the dabatabse
    await newRole.save();

    // send the confirmation to frontend
    return new NextResponse(
      JSON.stringify({ message: "Role created successfully!", data: newRole }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating role " + err, { status: 500 });
  }
};
