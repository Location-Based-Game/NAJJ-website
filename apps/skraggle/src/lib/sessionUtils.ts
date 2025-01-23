import { cookies } from "next/headers";
import { decryptJWT, encryptJWT } from "./jwtUtils";
import { NextRequest, NextResponse } from "next/server";
import { sessionSchema, SessionData } from "@schemas/sessionSchema";

/**
 * Reads the session cookie and deserializes and validates the JWT
 */
export async function getSessionData() {
  let session = cookies().get("__session")?.value;
  if (!session) {
    throw new Error("Session not set!");
  }

  const parsedData = await decryptJWT(session);
  const validatedData = sessionSchema.safeParse(parsedData);
  if (!validatedData.success) {
    throw new Error("Invalid session data!");
  }

  return validatedData.data;
}

const secondsUntilExpiration = 10000;

export async function setSessionCookie(sessionData: SessionData) {
  const expires = new Date(Date.now() + secondsUntilExpiration * 1000);
  const session = await encryptJWT({ ...sessionData });
  cookies().set("__session", session, { expires, httpOnly: true });
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;
  if (!session) return;

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
  });

  //setup for redux state
  res.cookies.set({
    name: "session_data",
    value: JSON.stringify(validatedData.data),
    expires,
  });

  return res;
}

export function deleteSession() {
  cookies().delete("__session");
  cookies().delete("session_data");
}
