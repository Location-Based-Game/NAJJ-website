"use server";

import { rtdb } from "@/app/firebaseConfig";
import { playerKeySchema, PlayerKeyType } from "@/schemas/playerIdSchema";
import { child, ref, remove, get } from "firebase/database";

export default async function removePlayer(data: PlayerKeyType) {
  const validatedData = playerKeySchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId, playerKey } = validatedData.data;

  const playersRef = ref(rtdb, `activeGames/${gameId}/players`);
  await remove(child(playersRef, playerKey));
}
