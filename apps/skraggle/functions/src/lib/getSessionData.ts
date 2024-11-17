import { type Request } from "firebase-functions/v2/https";
import { decryptJWT } from "./jwtUtils";
import { sessionSchema } from "./sessionSchema";

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
