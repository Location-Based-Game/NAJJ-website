import { rtdb } from "@/app/firebaseConfig";
import { InitialDiceData } from "@/firebase/CreateRoom";
import { ref, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//TODO Validation
const CreateTurnNumbersSchema = z.object({
  gameId: z.string().length(4),
  playerIds: z.string().array(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { gameId, playerIds } = body as {
    gameId: string;
    playerIds: string[];
  };

  const dbRef = ref(rtdb);
  const updates: any = {};
  for (let i = 0; i < playerIds.length; i++) {
    const diceData: InitialDiceData = {
      dice1: 1 + i,
      dice2: 1 + i,
    };

    updates[`activeGames/${gameId}/initialDiceData/${playerIds[i]}`] = diceData;
  }
  update(dbRef, updates);

  return NextResponse.json({ message: "success" });
}
