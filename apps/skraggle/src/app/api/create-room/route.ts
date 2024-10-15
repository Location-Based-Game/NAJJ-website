import { decryptJWT } from "@/lib/decryptJWT";
import { encryptJWT } from "@/lib/encryptJWT";
import { addPlayer } from "@/server-actions/addPlayer";
import createRoom from "@/server-actions/createRoom";
import setHost from "@/server-actions/setHost";
import { SessionData } from "@/store/logInCreateSlice";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createRoomSchema = z.object({
  gameId: z.string().length(4),
  playerName: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params = {
    gameId: searchParams.get("gameId"),
    playerName: searchParams.get("playerName")
  };

  const validatedData = createRoomSchema.safeParse(params);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId, playerName } = validatedData.data;

  //add playerId and playerName to session
  let session = cookies().get("session")?.value;
  if (!session) {
    throw new Error("Session not set!");
  }

  const parsed = (await decryptJWT(session)) as SessionData;
  if (parsed.gameId !== gameId) {
    throw new Error("Invalid Game ID!");
  }

  await createRoom({ gameId });

  const playerId = await addPlayer({
    gameId,
    playerName,
  });

  await setHost({ gameId, playerId });

  const expires = new Date(Date.now() + 100 * 1000);
  session = await encryptJWT({ playerName, playerId, gameId, expires });
  cookies().set("session", session, { expires, httpOnly: true });

  return NextResponse.json(playerId);
}
