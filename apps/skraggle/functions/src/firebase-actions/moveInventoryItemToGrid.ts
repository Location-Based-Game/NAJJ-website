import { Item } from "../../../schemas/itemSchema";
import { Inventory, GameStates, ItemTypes } from "../../../types";
import { db } from "../lib/firebaseAdmin";
import { transitionTurnsDiceRollToFirstTurn } from "./transitionTurnsDiceRollToFirstTurn";

export async function moveInventoryItemToGrid(
  gameId: string,
  playerId: string,
  currentItems: Inventory,
) {
  const inventoriesRef = db.ref(
    `activeGames/${gameId}/inventories/${playerId}`,
  );

  //remove placed items from player inventory and store them on the grid
  const gridRef = db.ref(`activeGames/${gameId}/grid`);
  const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
  const gameState = (await gameStateRef.get()).val() as GameStates;
  let hasTransitionedToGameplay = false;

  await Promise.all(
    Object.values(currentItems)
      .filter((item) => item.isPlaced || item.type === ItemTypes.StartingDice)
      .map(MoveItem),
  );

  async function MoveItem(item: Item<any>) {
    await Promise.all([
      inventoriesRef.child(item.itemId).remove(),
      gridRef.child(item.itemId).set(item)
    ])
    delete currentItems[item.itemId];

    if (
      gameState === "TurnsDiceRoll" &&
      item.type === ItemTypes.StartingDice
    ) {
      await setDiceInventory(JSON.parse(item.itemData).playerAmount);
    }
  }

  async function setDiceInventory(playerCount: number) {
    const diceCount = (await gridRef.get()).numChildren();
    if (diceCount === playerCount * 2 && !hasTransitionedToGameplay) {
      hasTransitionedToGameplay = true;
      await transitionTurnsDiceRollToFirstTurn(gameId);
    }
  }

  return { gameState };
}
