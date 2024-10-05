import { rtdb } from "@/app/firebaseConfig";
import { ref, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

//TODO Validation
const CreateTurnNumbersSchema = z.object({
    gameId: z.string().length(4),
    playerIds: z.string().array()
})

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log(body.gameId)
    const { gameId, playerIds } = body as {
        gameId: string;
        playerIds: string[];
    };

    const dbRef = ref(rtdb)
    const updates:any = {};
    for (let i = 0; i < playerIds.length; i++) {
        updates[`activeGames/${gameId}/initialDiceData/${playerIds[i]}`] = {
            dice1: 1 + i,
            dice2: 1 + i
        }
    }
    update(dbRef, updates);

    return NextResponse.json({message: "success"})
}