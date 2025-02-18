import { GameStates, Inventories, PlayersData } from "../../../types";
import { db } from "../lib/firebaseAdmin";
import { getLetterBlocks } from "../lib/getLetterBlocks";

/**
 * in order to prevent the game from being stuck on TurnsDiceRoll state,
 * just transition to Gameplay state if a player leaves/disconnects
 */
export async function transitionTurnsDiceRollToFirstTurn(gameId: string) {
  const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
  const gridRef = db.ref(`activeGames/${gameId}/grid`);
  const gameStateSnapshot = await gameStateRef.get();

  if (!gameStateSnapshot.exists()) return;
  const gameState = gameStateSnapshot.val() as GameStates;

  if (gameState === "TurnsDiceRoll") {
    const newState: GameStates = "FirstTurn";
    await Promise.all([gameStateRef.set(newState), gridRef.remove()]);
  } else {
    return;
  }

  const inventoriesRef = db.ref(`activeGames/${gameId}/inventories`);
  const playersRef = db.ref(`activeGames/${gameId}/players`);
  const players = (await playersRef.get()).val() as PlayersData;

  const letterBlockInventories: Inventories = {};
  Object.keys(players).forEach((id) => {
    letterBlockInventories[id] = getLetterBlocks({}, id);
  });

  await inventoriesRef.set(letterBlockInventories);
}
