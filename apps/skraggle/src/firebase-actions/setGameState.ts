import "server-only";

import { gameIdSchema } from "@/schemas/gameIdSchema";
import { setGameStateSchema } from "@/schemas/gameStateSchema";
import { z } from "zod";
import { db } from "@/lib/firebaseAdmin";

const schema = gameIdSchema.merge(setGameStateSchema)
type SetGameState = z.infer<typeof schema>

export default async function setGameState(data:SetGameState) {
  const validatedData = schema.safeParse(data)

  if (!validatedData.success) {
    console.error(validatedData.error)
    throw new Error("Invalid Data!");
  }

  const { gameId, gameState } = validatedData.data

  const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
  await gameStateRef.set(gameState);
}
