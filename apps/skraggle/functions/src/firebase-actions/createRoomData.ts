import { GameRoom } from "../../../types";
import { db } from "../lib/firebaseAdmin";

export async function createRoomData(gameId: string) {
  const gameRoomData: GameRoom = {
    id: gameId,
    gameState: "Menu",
    currentTurn: 0,
    players: {},
    inventories: {},
    grid: {},
  };

  await db.ref(`activeGames/${gameId}`).set(gameRoomData);
}
