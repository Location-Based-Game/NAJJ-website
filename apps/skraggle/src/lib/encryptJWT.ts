import { SignJWT } from "jose";

const secretKey = process.env.JWT_SECRET_TOKEN;
const key = new TextEncoder().encode(secretKey)

export async function encryptJWT(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('100 sec from now')
        .sign(key)
}