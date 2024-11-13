import { deleteSession, getSessionData } from "@/lib/sessionUtils";
import { createTurnNumbers } from "@/firebase-actions/createTurnNumbers";
import getHost from "@/firebase-actions/getHost";
import setGameState from "@/firebase-actions/setGameState";
import { NextResponse } from "next/server";

//START GAME
export async function GET() {
  try {
    const { gameId, playerId } = await getSessionData();
    const host = await getHost({ gameId });
    if (host !== playerId) {
      return NextResponse.json(
        { error: "Only the host can start the game" },
        { status: 403 },
      );
    }
  
    await setGameState({
      gameId,
      gameState: "TurnsDiceRoll",
    });
  
    await createTurnNumbers(gameId);
  
    return NextResponse.json({ data: "Success" });
  } catch (error) {
    deleteSession();
    console.error(error)
    return NextResponse.json({ error: `${error}` });
  }
}
