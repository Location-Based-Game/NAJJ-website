import { getSessionData } from "@/lib/sessionUtils";
import getHost from "@/server-actions/getHost";
import { NextResponse } from "next/server";

//REJOIN
export async function GET() {
  const { gameId, playerId, playerName } = await getSessionData();

  try {
    const host = await getHost({ gameId });
    if (host === playerId) {
      return NextResponse.json({
        data: { gameId, playerId, playerName },
        isHost: true,
      });
    }

    return NextResponse.json({ data: { gameId, playerId, playerName } });
  } catch (error) {
    return NextResponse.json({ data: error });
  }
}
