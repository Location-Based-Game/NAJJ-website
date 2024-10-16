import { cookies } from "next/headers";
import { decryptJWT } from "./decryptJWT";
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
