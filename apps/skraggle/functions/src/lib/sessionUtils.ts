import type { Request } from "firebase-functions/v2/https";
import { decryptJWT, encryptJWT } from "./jwtUtils";
import type { CookieOptions, Response } from "express";
import { sessionSchema, SessionData } from "../../../schemas/sessionSchema";

export async function getSessionData(request: Request) {
  const cookies = request.headers.cookie;
  if (!cookies) {
    throw new Error("Session not set!");
  }
  const sessionCookie = cookies
    .split("; ")
    .find((row) => row.startsWith("__session="))
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
  const cookieData: CookieOptions = {
    expires,
    httpOnly: true,
  };


  if (process.env.IS_LOCAL !== "true") {
    cookieData.secure = true,
    cookieData.sameSite = "none",
    cookieData.domain = "skraggl.io";
  }

  response.cookie("__session", session, cookieData);
}

export async function deleteSession(response: Response) {
  const cookieData: CookieOptions = {};

  if (process.env.IS_LOCAL !== "true") {
    cookieData.secure = true,
    cookieData.sameSite = "none",
    cookieData.domain = "skraggl.io";
  }

  response.clearCookie("__session", cookieData);
  response.clearCookie("session_data", cookieData);
}
