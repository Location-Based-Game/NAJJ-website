'use server'

import { rtdb } from "@/app/firebaseConfig";
import { gameIdSchema } from "@/schemas/gameIdSchema";
import { setGameStateSchema } from "@/schemas/gameStateSchema";
import { ref, set } from "firebase/database";
import { z } from "zod";

const schema = gameIdSchema.merge(setGameStateSchema)
type SetGameState = z.infer<typeof schema>

export default async function setGameState(data:SetGameState) {
  const validatedData = schema.safeParse(data)

  if (!validatedData.success) {
    console.error(validatedData.error)
    throw new Error("Invalid Data!");
  }

  const { gameId, gameState } = validatedData.data

  const gameStateRef = ref(rtdb, `activeGames/${gameId}/gameState`);
  await set(gameStateRef, gameState);
}
