import { GameSettings } from "../../../schemas/gameSettingsSchema";
import { GameRoom } from "../../../types";
import { db } from "../lib/firebaseAdmin";

export async function createRoomData(
  gameId: string,
  gameSettings: GameSettings,
) {
  const gameRoomData: GameRoom = {
    id: gameId,
    gameState: "Menu",
    currentTurn: 0,
    players: {},
    inventories: {},
    grid: {},
    gameSettings
  };

  await db.ref(`activeGames/${gameId}`).set(gameRoomData);
}
