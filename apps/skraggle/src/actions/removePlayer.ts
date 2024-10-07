'use server'

import { rtdb } from "@/app/firebaseConfig";
import { gameIdSchema } from "@/schemas/gameIdSchema";
import { child, ref, remove } from "firebase/database";
import { z } from "zod";

const removePlayerSchema = gameIdSchema.extend({
    playerKey: z.string().min(1)
  })

  type RemovePlayerType = z.infer<typeof removePlayerSchema>

export default async function removePlayer(data: RemovePlayerType) {
    const validatedData = removePlayerSchema.safeParse(data)
  
    if (!validatedData.success) {
      console.error(validatedData.error)
      throw new Error("Invalid Data!");
    }

    const { gameId, playerKey } = validatedData.data

    const playersRef = ref(rtdb, `activeGames/${gameId}/players`);
    await remove(child(playersRef, playerKey));
}