import { db } from "../lib/firebaseAdmin";
import { GameRoom } from "../types";

export default async function removePlayer(gameId: string, playerId: string) {
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
      if (players.hasOwnProperty(key) && players[key].turn >= currentTurn && players[key].turn > players[playerId].turn) {
        gameData.players[key].turn--;
      }
    }

    if (gameData.currentTurn > players[playerId].turn) {
      gameData.currentTurn--;
    }

    if (!players) return;
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
