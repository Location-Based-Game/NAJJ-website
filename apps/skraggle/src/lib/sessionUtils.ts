import { cookies } from "next/headers";
import { decryptJWT, encryptJWT } from "./jwtUtils";
import { sessionSchema } from "@/schemas/sessionSchema";

/**
 * Reads the session cookie and deserializes and validates the JWT
 */
export async function getSessionData() {
  let session = cookies().get("session")?.value;
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

const secondsUntilExpiration = 10;

export async function setSessionCookie(
  playerName: string,
  playerId: string,
  gameId: string,
) {
  const expires = new Date(Date.now() + secondsUntilExpiration * 1000);
  const session = await encryptJWT({ playerName, playerId, gameId, expires });
  cookies().set("session", session, { expires, httpOnly: true });
}

export function deleteSession() {
  cookies().delete("session");
}
