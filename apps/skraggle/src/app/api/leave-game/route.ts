import { deleteSession, getSessionData } from "@/lib/sessionUtils";
import getHost from "@/firebase-actions/getHost";
import removePlayer from "@/firebase-actions/removePlayer";
import removePlayerHost from "@/firebase-actions/removePlayerHost";
import { NextResponse } from "next/server";

//LEAVE GAME
export async function GET() {
  try {
    const { gameId, playerId } = await getSessionData();
  
    const host = await getHost({ gameId });
    if (host === playerId) {
      await removePlayerHost({ gameId, playerId });
    } else {
      await removePlayer({ gameId, playerId });
    }
  
    deleteSession();
    return NextResponse.json({ data: "success" });
  } catch (error) {
    deleteSession();
    console.error(error)
    return NextResponse.json({ error: `${error}` });
  }
}
