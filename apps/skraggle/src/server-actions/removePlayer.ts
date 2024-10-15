"use server";

import { rtdb } from "@/app/firebaseConfig";
import { playerIdSchema, PlayerIdType } from "@/schemas/playerIdSchema";
import { child, ref, remove, get } from "firebase/database";

export default async function removePlayer(data: PlayerIdType) {
  const validatedData = playerIdSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId, playerId } = validatedData.data;

  const playersRef = ref(rtdb, `activeGames/${gameId}/players`);
  await remove(child(playersRef, playerId));
}
