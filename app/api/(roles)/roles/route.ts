import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Role from "@/lib/models/role";

export const GET = async () => {
  try {
    await connect();
    const roles = await Role.find();

    return new NextResponse(
      JSON.stringify({ message: "Roles fetched successfully!", data: roles }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching roles" + err, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newRole = new Role(body);
    await newRole.save();

    return new NextResponse(
      JSON.stringify({ message: "Role created successfully!", data: newRole }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating role" + err, { status: 500 });
  }
};
