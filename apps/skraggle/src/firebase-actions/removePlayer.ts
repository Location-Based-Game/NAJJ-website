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

  //updates the turn numbers for all players
  const gameRef = db.ref(`activeGames/${gameId}`);
  await gameRef.transaction((gameData: GameRoom) => {
    if (gameData === null) return gameData;

    const { currentTurn, players } = gameData;
    for (const key in players) {
      if (
        players.hasOwnProperty(key) &&
        players[key].turn >= currentTurn
      ) {
        gameData.players[key].turn--;
      }
    }

    const playerAmount = Object.keys(players).length;
    gameData.currentTurn = gameData.currentTurn % playerAmount;

    return gameData;
  });

  await Promise.all([
    playerRef.remove(),
    playerSignalingRef.remove(),
    playerInventoryRef.remove(),
  ]);

}
