"use server"

import { rtdb } from "@/app/firebaseConfig";
import { gameIdSchema, GameIdType } from "@/schemas/gameIdSchema";
import { get, ref } from "firebase/database";

export default async function getHost(data: GameIdType) {
  const validatedData = gameIdSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId } = validatedData.data;

  const hostRef = ref(rtdb, `activeGames/${gameId}/host`);
  const snapshot = await get(hostRef);

  if (!snapshot.exists()) {
    throw new Error("Game not available!");
  } else {
    return snapshot.val() as string;
  }
}
