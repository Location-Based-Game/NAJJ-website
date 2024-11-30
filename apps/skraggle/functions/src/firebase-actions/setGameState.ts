//@ts-ignore
import { GameStates } from "../types";
import { db } from "../lib/firebaseAdmin";

export default async function setGameState(gameId: string, gameState: GameStates) {
  const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
  await gameStateRef.set(gameState);
}
