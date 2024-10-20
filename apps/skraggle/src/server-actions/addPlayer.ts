import "server-only";
import { z } from "zod";
import { gameIdSchema } from "@/schemas/gameIdSchema";
import { db, Reference } from "@/lib/firebaseAdmin";

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

  const playersRef = db.ref(`activeGames/${gameId}/players`);
  let playerId = "";

  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
  ) {
    const testPlayerRef = db.ref(`activeGames/${gameId}/players/testPlayer/name`);
    await testPlayerRef.set(playerName);
    playerId = "testPlayer";
  } else {
    playerId = await addPlayerTransaction(playersRef, playerName);
  }

  return playerId;
}

async function addPlayerTransaction(
  playersRef: Reference,
  playerName: string,
) {
  let playerId = "";

  await playersRef.transaction((currentPlayers) => {
    if (currentPlayers === null) {
      currentPlayers = {};
    }

    const playerCount = Object.keys(currentPlayers).length;
    if (playerCount >= 8) {
      throw new Error("Max players reached!");
    }

    const newPlayerRef = playersRef.push();
    if (newPlayerRef.key) {
      playerId = newPlayerRef.key;
      currentPlayers[playerId] = {
        name: playerName
      };
    } else {
      throw new Error("Player key not created");
    }

    return currentPlayers;
  });

  return playerId;
}
