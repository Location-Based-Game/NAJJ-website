import { cookies } from "next/headers";
import { encryptJWT } from "./encryptJWT";

const secondsUntilExpiration = 10;

export async function setSessionCookie(playerName: string, playerId: string, gameId: string) {
    const expires = new Date(Date.now() + secondsUntilExpiration * 1000);
    const session = await encryptJWT({ playerName, playerId, gameId, expires });
    cookies().set("session", session, { expires, httpOnly: true });
}