import { cookies } from "next/headers";
import { decryptJWT, encryptJWT } from "./jwtUtils";
import { NextRequest, NextResponse } from "next/server";
import { sessionSchema, SessionData } from "@schemas/sessionSchema";

const secondsUntilExpiration = 10000;

export async function setSessionCookie(sessionData: SessionData) {
  const expires = new Date(Date.now() + secondsUntilExpiration * 1000);
  const session = await encryptJWT({ ...sessionData });
  cookies().set("__session", session, { expires, httpOnly: true });
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;
  if (!session) return NextResponse.next();

  const parsedData = await decryptJWT(session);
  const validatedData = sessionSchema.safeParse(parsedData);
  if (!validatedData.success) {
    throw new Error("Invalid session data!");
  }

  const expires = new Date(Date.now() + secondsUntilExpiration * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "__session",
    value: await encryptJWT(validatedData.data),
    httpOnly: true,
    expires,
    secure: true,
    sameSite: "none",
  });

  //setup for redux state
  res.cookies.set({
    name: "session_data",
    value: JSON.stringify(validatedData.data),
    expires,
    secure: true,
    sameSite: "none",
  });

  return res;
}
