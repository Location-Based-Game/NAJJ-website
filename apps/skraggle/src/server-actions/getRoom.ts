'use server'

import { ref, get, child } from "firebase/database";
import { GameRoom } from "./createRoom";
import { rtdb } from "@/app/firebaseConfig";
import { gameIdSchema, GameIdType } from "@/schemas/gameIdSchema";

export default async function getRoom(data:GameIdType): Promise<GameRoom> {
  const validatedData = gameIdSchema.safeParse(data)

  if (!validatedData.success) {
    throw new Error("invalid code!")
  }

  const { gameId } = validatedData.data

  const dbRef = ref(rtdb);
  const snapshot = await get(child(dbRef, `activeGames/${gameId}`));

  if (!snapshot.exists()) {
    throw new Error("Game not available!");
  } else {
    return snapshot.val() as GameRoom;
  }
}
