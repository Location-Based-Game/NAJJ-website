import "server-only";
import { playerIdSchema, PlayerIdType } from "@/schemas/playerIdSchema";
import { db } from "@/lib/firebaseAdmin";
import type { GameRoom } from "./createRoom";

export default async function removePlayer(data: PlayerIdType) {
  const validatedData = playerIdSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId, playerId } = validatedData.data;

  const playerRef = db.ref(`activeGames/${gameId}/players/${playerId}`);
  const playerSignalingRef = db.ref(
    `activeGames/${gameId}/signaling/players/${playerId}`,
  );
  const playerInventoryRef = db.ref(
    `activeGames/${gameId}/inventories/${playerId}`,
  );

  await Promise.all([
    playerRef.remove(),
    playerSignalingRef.remove(),
    playerInventoryRef.remove(),
  ]);

  //updates the turn numbers for all players
  const gameRef = db.ref(`activeGames/${gameId}`);
  await gameRef.transaction((gameData: GameRoom) => {
    if (gameData === null) return gameData;

    const { currentTurn, players } = gameData;
    for (const playerId in players) {
      if (
        players.hasOwnProperty(playerId) &&
        players[playerId].turn >= currentTurn
      ) {
        gameData.players[playerId].turn--;
        gameData.currentTurn--;
      }
    }

    return gameData;
  });
}
