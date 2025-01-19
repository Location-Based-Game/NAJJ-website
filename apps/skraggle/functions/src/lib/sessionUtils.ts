import type { Request } from "firebase-functions/v2/https";
import { decryptJWT, encryptJWT } from "./jwtUtils";
import { SessionData, sessionSchema } from "../schemas/sessionSchema";
import type { Response } from "express";

export async function getSessionData(request: Request) {
  const cookies = request.headers.cookie;
  if (!cookies) {
    throw new Error("Session not set!");
  }
  const sessionCookie = cookies
    .split("; ")
    .find((row) => row.startsWith("session="))
    ?.split("=")[1];

  if (!sessionCookie) {
    throw new Error("Session not set!");
  }

  const parsedData = await decryptJWT(sessionCookie);
  const validatedData = sessionSchema.safeParse(parsedData);
  if (!validatedData.success) {
    throw new Error("Invalid session data!");
  }
  return validatedData.data;
}

const secondsUntilExpiration = 10000;

export async function setSessionCookie(
  response: Response,
  sessionData: SessionData,
) {
  const expires = new Date(Date.now() + secondsUntilExpiration * 1000);
  const session = await encryptJWT({ ...sessionData });
  response.cookie("session", session, { expires, httpOnly: true });
}

export async function deleteSession(response: Response) {
  response.clearCookie("session");
  response.clearCookie("session_data");
}
