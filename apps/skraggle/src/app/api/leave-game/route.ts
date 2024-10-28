import { deleteSession, getSessionData } from "@/lib/sessionUtils";
import getHost from "@/server-actions/getHost";
import removePlayer from "@/server-actions/removePlayer";
import removePlayerHost from "@/server-actions/removePlayerHost";
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
