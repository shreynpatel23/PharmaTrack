import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    cookies().delete("userData");

    return new NextResponse(
      JSON.stringify({
        message: "Logout SuccessFull!",
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in logout " + err, { status: 500 });
  }
};
