import "server-only";
import { gameIdSchema, GameIdType } from "@/schemas/gameIdSchema";
import { GameStates } from "@/schemas/gameStateSchema";
import { db } from "@/lib/firebaseAdmin";
import { PlayersData } from "@/components/PlayersDataProvider";

export type GameRoom = {
  id: string;
  gameState: GameStates;
  players: PlayersData | null;
  turnOrder: string[] | null;
  currentTurn: number;
};

export default async function createRoom(data: GameIdType) {
  const validatedData = gameIdSchema.safeParse(data)

  if (!validatedData.success) {
    throw new Error("invalid code!")
  }

  const { gameId } = validatedData.data

  const gameRoomData: GameRoom = {
    id: gameId,
    gameState: "Menu",
    players: null,
    turnOrder: [],
    currentTurn: 0,
  };

  await db.ref(`activeGames/${gameId}`).set(gameRoomData)
}
