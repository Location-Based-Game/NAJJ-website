import { db } from "@/lib/firebaseAdmin";
import { deleteSession, getSessionData } from "@/lib/sessionUtils";
import getHost from "@/server-actions/getHost";
import { serverTimestamp } from "firebase/database";
import { NextResponse } from "next/server";

//REJOIN
export async function GET() {
  const { gameId, playerId, playerName } = await getSessionData();

  try {
    const host = await getHost({ gameId });

    //remove signaling data to reestablish webRTC peers
    const playerSignalingRef = db.ref(`activeGames/${gameId}/signaling/${playerId}`)
    await playerSignalingRef.remove();
    const playerRef = db.ref(`activeGames/${gameId}/signaling/players/${playerId}`)
    await playerRef.set({
      signalStatus: "pending",
      name: playerName,
      timestamp: serverTimestamp()
    })

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
