"use server";

import { rtdb } from "@/app/firebaseConfig";
import { playerIdSchema, PlayerIdType } from "@/schemas/playerIdSchema";
import { ref, update } from "firebase/database";

export default async function setHost(data: PlayerIdType) {
  const validatedData = playerIdSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId, playerId } = validatedData.data;

  const gameRef = ref(rtdb, `activeGames/${gameId}`);
  await update(gameRef, {
    host: playerId,
  });
}
