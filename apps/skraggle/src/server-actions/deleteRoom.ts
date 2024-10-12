"use server";

import { rtdb } from "@/app/firebaseConfig";
import { gameIdSchema } from "@/schemas/gameIdSchema";
import { child, get, ref, remove } from "firebase/database";
import { z } from "zod";

const deleteRoomSchema = gameIdSchema.extend({
  playerKey: z.string().min(1),
});

export default async function deleteRoom(
  data: z.infer<typeof deleteRoomSchema>,
) {
  const validatedData = deleteRoomSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId, playerKey } = validatedData.data;

  const playerRef = ref(rtdb, `activeGames/${gameId}/players/${playerKey}`);
  const snapshot = await get(playerRef);

  if (!snapshot.exists()) {
    throw new Error("Invalid Data!");
  }

  const gameRef = ref(rtdb, "activeGames");
  await remove(child(gameRef, gameId));
}
