"use server";

import {
  DatabaseReference,
  push,
  ref,
  runTransaction,
  set,
} from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { z } from "zod";
import { gameIdSchema } from "@/schemas/gameIdSchema";
import { cookies } from "next/headers";
import { encryptJWT } from "@/lib/encryptJWT";
import { decryptJWT } from "@/lib/decryptJWT";

const addPlayerSchema = gameIdSchema.extend({
  playerName: z.string().min(1),
});

type AddPlayerType = z.infer<typeof addPlayerSchema>;

export async function addPlayer(data: AddPlayerType): Promise<string> {
  const validatedData = addPlayerSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId, playerName } = validatedData.data;

  const playersRef = ref(rtdb, `activeGames/${gameId}/players`);
  let playerId = "";

  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
  ) {
    const testPlayerRef = ref(rtdb, `activeGames/${gameId}/players/testPlayer`);
    await set(testPlayerRef, playerName);
    playerId = "testPlayer";
  } else {
    playerId = await addPlayerTransaction(playersRef, playerName);
  }

  return playerId;
}

async function addPlayerTransaction(
  playersRef: DatabaseReference,
  playerName: string,
) {
  let playerId = "";

  await runTransaction(playersRef, (currentPlayers) => {
    if (currentPlayers === null) {
      currentPlayers = {};
    }

    const playerCount = Object.keys(currentPlayers).length;
    if (playerCount >= 8) {
      throw new Error("Max players reached!");
    }

    const newPlayerRef = push(playersRef);
    if (newPlayerRef.key) {
      playerId = newPlayerRef.key;
      currentPlayers[playerId] = playerName;
    } else {
      throw new Error("Player key not created");
    }

    return currentPlayers;
  });

  return playerId;
}
