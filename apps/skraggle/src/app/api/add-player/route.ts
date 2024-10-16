import { getSessionData, setSessionCookie } from "@/lib/sessionUtils";
import { validateSearchParams } from "@/lib/validateSearchParams";
import { addPlayer } from "@/server-actions/addPlayer";
import getRoom from "@/server-actions/getRoom";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addPlayerSchema = z.object({
  playerName: z.string().min(1),
});

//ADD PLAYER
export async function GET(request: NextRequest) {
  const { playerName } = validateSearchParams<z.infer<typeof addPlayerSchema>>(
    request.url,
    addPlayerSchema,
  );
  const { gameId } = await getSessionData();

  //first check if room exists
  await getRoom({ gameId });

  const playerId = await addPlayer({ gameId, playerName });

  await setSessionCookie(playerName, playerId, gameId);

  return NextResponse.json(playerId);
}
