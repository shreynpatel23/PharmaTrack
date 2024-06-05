import * as jose from "jose";

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.TOKEN_SECRET || "sign"),
};

async function validateToken(token: string | undefined) {
  try {
    // check if the token is present
    if (!token) {
      return false;
    }
    // decode the jwt token here
    const { payload }: { payload: any } = await jose.jwtVerify(
      token,
      jwtConfig.secret
    );

    // check for the role permission
    if (
      payload?.selectedUser?.role?.name?.toLowerCase() ===
      "Employee"?.toLowerCase()
    ) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("error in validating " + err);
  }
}

export const authMiddleware = async (request: Request) => {
  const token = request.headers.get("authorization")?.split(" ")[2];
  let response;
  await validateToken(token)
    .then((res) => {
      response = res;
    })
    .catch((err) => console.log("err " + err));
  return { isValid: response };
};
