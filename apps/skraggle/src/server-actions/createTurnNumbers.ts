import { rtdb } from "@/app/firebaseConfig";
import { InitialDiceData } from "@/server-actions/createRoom";
import { gameIdSchema } from "@/schemas/gameIdSchema";
import { ref, update } from "firebase/database";
import { z } from "zod";

const createTurnNumbersSchema = gameIdSchema.extend({
  playerIds: z.string().array(),
});

export type CreateTurnNumbersType = z.infer<typeof createTurnNumbersSchema>

export async function createTurnNumbers(data: CreateTurnNumbersType) {
  const validatedBody = createTurnNumbersSchema.safeParse(data);

  if (!validatedBody.success) {
    console.error(validatedBody.error);
    throw new Error("Invalid Data!")
  }

  const { gameId, playerIds } = validatedBody.data;

  if (playerIds.length === 0) {
    throw new Error("No Player Id Given!")
  }

  const dbRef = ref(rtdb);
  const updates: any = {};
  for (let i = 0; i < playerIds.length; i++) {
    const diceData: InitialDiceData = {
      dice1: 1 + i,
      dice2: 1 + i,
    };

    updates[`activeGames/${gameId}/initialDiceData/${playerIds[i]}`] = diceData;
  }
  await update(dbRef, updates);
}
