import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Role from "@/lib/models/role";

// get user details api
export const GET = async (request: Request, context: { params: any }) => {
  try {
    const userId = context.params.userId;

    // establish the database connection
    await connect();

    // get all the roles as well to avoid the MissingSchemaError
    const roles = await Role.find({});

    // fetch all the users where storeId is equal to params store id
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
    return new NextResponse("Error in fetching users " + err, { status: 500 });
  }
};
