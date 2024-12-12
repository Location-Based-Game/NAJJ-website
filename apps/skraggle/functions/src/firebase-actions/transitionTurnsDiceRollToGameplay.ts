import { GetLetterBlocks } from "../endpoints/setInventory";
import { db } from "../lib/firebaseAdmin";
import { GameStates, Inventories, PlayersData } from "../types";

/**
 * in order to prevent the game from being stuck on TurnsDiceRoll state,
 * just transition to Gameplay state if a player leaves/disconnects
 */
export async function transitionTurnsDiceRollToGameplay(gameId: string) {
  const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
  const gridRef = db.ref(`activeGames/${gameId}/grid`);
  const gameStateSnapshot = await gameStateRef.get();

  if (!gameStateSnapshot.exists()) return;
  const gameState = gameStateSnapshot.val() as GameStates;

  if (gameState === "TurnsDiceRoll") {
    await Promise.all([gameStateRef.set("Gameplay"), gridRef.remove()]);
  } else {
    return;
  }

  const inventoriesRef = db.ref(`activeGames/${gameId}/inventories`);
  const playersRef = db.ref(`activeGames/${gameId}/players`);
  const players = (await playersRef.get()).val() as PlayersData;

  const letterBlockInventories: Inventories = {};
  Object.keys(players).forEach((id) => {
    letterBlockInventories[id] = GetLetterBlocks({}, id);
  });

  inventoriesRef.set(letterBlockInventories);
}
