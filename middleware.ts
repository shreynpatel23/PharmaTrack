import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/apis/authMiddleware";
import { isRouteProtected } from "./utils/checkProtectedRoutes";

export const config = {
  matcher: "/api/:path*",
};

export default async function middleware(request: Request) {
  // check if the route that you are accessing is protected and the method for it is eigther POST, PUT OR DELETE
  if (
    isRouteProtected(request.url) &&
    (request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "DELETE")
  ) {
    // get the authResult form the authMiddleware
    const authResult = await authMiddleware(request);
    // if it is false then return access denined
    if (!authResult.isValid) {
      return new NextResponse(JSON.stringify({ message: "Access Denied!" }), {
        status: 401,
      });
    }
  }

  return NextResponse.next();
}
