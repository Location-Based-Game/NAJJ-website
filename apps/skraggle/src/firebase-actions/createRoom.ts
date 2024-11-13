import "server-only";
import { gameIdSchema, GameIdType } from "@/schemas/gameIdSchema";
import { GameStates } from "@/schemas/gameStateSchema";
import { db } from "@/lib/firebaseAdmin";
import { PlayersData } from "@/store/playersSlice";

export type GameRoom = {
  id: string;
  gameState: GameStates;
  players: PlayersData;
  currentTurn: number;
};

export default async function createRoom(data: GameIdType) {
  const validatedData = gameIdSchema.safeParse(data)

  if (!validatedData.success) {
    throw new Error("invalid code!")
  }

  const { gameId } = validatedData.data

  const gameRoomData: Partial<GameRoom> = {
    id: gameId,
    gameState: "Menu",
    currentTurn: 0,
  };

  await db.ref(`activeGames/${gameId}`).set(gameRoomData)
}
