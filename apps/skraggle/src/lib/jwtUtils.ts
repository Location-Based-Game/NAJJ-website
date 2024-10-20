import { jwtVerify, SignJWT } from "jose";

const secretKey = process.env.JWT_SECRET_TOKEN;
const key = new TextEncoder().encode(secretKey);

export async function decryptJWT(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });

  return payload;
}

export async function encryptJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("100 sec from now")
    .sign(key);
}
