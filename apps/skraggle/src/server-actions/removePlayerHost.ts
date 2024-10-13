"use server";

import { rtdb } from "@/app/firebaseConfig";
import { ref, remove, get, child, update } from "firebase/database";
import removePlayer from "./removePlayer";
import { PlayersType } from "@/components/GetPlayers";
import { playerKeySchema, PlayerKeyType } from "@/schemas/removePlayerSchema";

export default async function removePlayerHost(data: PlayerKeyType) {
  const validatedData = playerKeySchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  await removePlayer(data);

  const { gameId } = validatedData.data;

  const gameRef = ref(rtdb, `activeGames/${gameId}`);
  const players = await get(child(gameRef, "players"));

  if (players.exists()) {
    const playerData = players.val() as PlayersType;
    await update(gameRef, {
      host: Object.keys(playerData)[0],
    });
  } else {
    await remove(ref(rtdb, `activeGames/${gameId}`));
  }
}
