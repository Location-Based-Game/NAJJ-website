"use server";

import { rtdb } from "@/app/firebaseConfig";
import { playerKeySchema, PlayerKeyType } from "@/schemas/removePlayerSchema";
import { ref, update } from "firebase/database";

export default async function setHost(data: PlayerKeyType) {
  const validatedData = playerKeySchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId, playerKey } = validatedData.data;

  const gameRef = ref(rtdb, `activeGames/${gameId}`);
  await update(gameRef, {
    host: playerKey,
  });
}
