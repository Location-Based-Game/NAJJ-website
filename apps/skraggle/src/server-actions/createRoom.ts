import "server-only";
import { gameIdSchema, GameIdType } from "@/schemas/gameIdSchema";
import { GameStates } from "@/schemas/gameStateSchema";
import { db } from "@/lib/firebaseAdmin";

//TODO update player data type
export type PlayerData = string;

export type InitialDiceData = {
  dice1: number;
  dice2: number;
};

export type GameRoom = {
  id: string;
  gameState: GameStates;
  players: PlayerData | null;
  turnOrder: string[] | null;
  initialDiceData: InitialDiceData | null;
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
    initialDiceData: null,
    currentTurn: 0,
  };

  await db.ref(`activeGames/${gameId}`).set(gameRoomData)
}
