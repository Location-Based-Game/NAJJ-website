import { jwtVerify, SignJWT } from "jose";

export async function decryptJWT(input: string) {
  const secretKey = process.env.JWT_SECRET_TOKEN;
  const key = new TextEncoder().encode(secretKey);
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });

  return payload;
}

export async function encryptJWT(payload: any) {
  const secretKey = process.env.JWT_SECRET_TOKEN;
  const key = new TextEncoder().encode(secretKey);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10000s")
    .sign(key);
}
