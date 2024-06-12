import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Role from "@/lib/models/role";
import { Types } from "mongoose";

// get user details api
export const GET = async (request: Request, context: { params: any }) => {
  try {
    const userId = context.params.userId;

    // check if the userId exist and is valid
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId!" }),
        { status: 400 }
      );
    }

    // establish the database connection
    await connect();

    // get all the roles as well to avoid the MissingSchemaError
    const roles = await Role.find({});

    // get user details from userID
    let user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User does not exist!",
        }),
        { status: 400 }
      );
    }

    // find the role of the user
    const userRole = roles.filter(
      (role) => String(role._id) === String(user.role)
    )[0];

    user = {
      ...user._doc,
      role: userRole,
    };

    return new NextResponse(
      JSON.stringify({
        message: "User Details fetched successfully!",
        data: user,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching user " + err, { status: 500 });
  }
};
