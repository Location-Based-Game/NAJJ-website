import { db } from "@/lib/firebaseAdmin";
import { deleteSession, getSessionData } from "@/lib/sessionUtils";
import getHost from "@/server-actions/getHost";
import { NextResponse } from "next/server";

//REJOIN
export async function GET() {
  const { gameId, playerId, playerName } = await getSessionData();

  try {
    const host = await getHost({ gameId });

    //reestablish webRTC peers
    const playerRef = db.ref(`activeGames/${gameId}/players/${playerId}`)
    const playerData = (await playerRef.get()).val()
    delete playerData["peer-answer"]
    delete playerData["peer-offer"]
    await playerRef.set(playerData)

    if (!playerId) {
      throw new Error("No playerId assigned!")
    }

    if (host === playerId) {
      return NextResponse.json({
        data: { gameId, playerId, playerName },
        isHost: true,
      });
    }

    return NextResponse.json({ data: { gameId, playerId, playerName } });
  } catch (error) {
    deleteSession();
    console.error(error)
    return NextResponse.json({ error: `${error}` });
  }
}
