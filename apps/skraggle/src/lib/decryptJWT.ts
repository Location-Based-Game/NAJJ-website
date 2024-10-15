import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET_TOKEN;
const key = new TextEncoder().encode(secretKey);

export async function decryptJWT(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });

  return payload;
}
