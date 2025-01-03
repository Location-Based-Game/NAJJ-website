'use server'

import { ref, get } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { GameRoom } from "@types";
import { GameIdType, gameIdSchema } from "@schemas/gameIdSchema";

export default async function getRoom(data:GameIdType): Promise<GameRoom> {
  const validatedData = gameIdSchema.safeParse(data)

  if (!validatedData.success) {
    throw new Error("invalid code!")
  }

  const { gameId } = validatedData.data

  const dbRef = ref(rtdb, `activeGames/${gameId}/id`);
  const snapshot = await get(dbRef);

  if (!snapshot.exists()) {
    throw new Error("Game not available!");
  } else {
    return snapshot.val() as GameRoom;
  }
}