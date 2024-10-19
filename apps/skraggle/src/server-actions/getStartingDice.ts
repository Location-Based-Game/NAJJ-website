'use server'

import { rtdb } from "@/app/firebaseConfig";
import { gameIdSchema } from "@/schemas/gameIdSchema";
import { ref, get } from "firebase/database";
import { z } from "zod";
import { InitialDiceData } from "./createRoom";

const getStartingDiceSchema = gameIdSchema.extend({
  playerId: z.string(),
});

export default async function getStartingDice(
  data: z.infer<typeof getStartingDiceSchema>,
) {
  const validatedData = getStartingDiceSchema.safeParse(data);

  if (!validatedData.success) {
    throw new Error("invalid code!");
  }

  const { gameId, playerId } = validatedData.data;

  const diceDataRef = ref(rtdb, `activeGames/${gameId}/initialDiceData`);

  const diceDataSnapshot = await get(diceDataRef);
  if (!diceDataSnapshot.exists()) {
    throw new Error("No dice data available!");
  }

  let id: string = "";
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
  ) {
    id = "testPlayer";
  } else {
    id = playerId;
  }

  const diceData = diceDataSnapshot.val()[id] as InitialDiceData;
  return diceData;
}