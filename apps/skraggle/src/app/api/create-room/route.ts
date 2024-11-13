import { deleteSession, getSessionData, setSessionCookie } from "@/lib/sessionUtils";
import { validateSearchParams } from "@/lib/validateSearchParams";
import { addPlayer } from "@/firebase-actions/addPlayer";
import createRoom from "@/firebase-actions/createRoom";
import setHost from "@/firebase-actions/setHost";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createRoomSchema = z.object({
  playerName: z.string().min(1),
});

//CREATE ROOM
export async function GET(request: NextRequest) {
  const { playerName } = validateSearchParams<z.infer<typeof createRoomSchema>>(
    request.url,
    createRoomSchema,
  );

  try {
    const { gameId } = await getSessionData();
    await createRoom({ gameId });
  
    const playerId = await addPlayer({
      gameId,
      playerName,
    });
  
    await setHost({ gameId, playerId });
  
    await setSessionCookie({ playerName, playerId, gameId });
  
    return NextResponse.json(playerId);
  } catch (error) {
    deleteSession();
    console.error(error)
    return NextResponse.json({ error: `${error}` });
  }
}
