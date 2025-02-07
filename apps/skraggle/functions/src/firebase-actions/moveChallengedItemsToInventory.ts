import { Inventory } from "../../../types";
import { db } from "../lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";

export default async function moveChallengedItemsToInventory(
  gameId: string,
  playerId: string,
) {
  const currentPlacedLettersRef = db.ref(
    `activeGames/${gameId}/challengeWords/placedLetters`,
  );
  const currentPlacedLettersSnapshot = await currentPlacedLettersRef.get();
  if (!currentPlacedLettersSnapshot.exists()) return;
  const currentPlacedLetters = currentPlacedLettersSnapshot.val() as Inventory;

  // Remove items from grid
  const gridRef = db.ref(`activeGames/${gameId}/grid`);
  await gridRef.transaction((grid: Inventory) => {
    if (grid === null) return grid;
    Object.keys(currentPlacedLetters).map((itemId) => {
      grid[itemId].isDestroyed = true;
    });
    return grid;
  });

  await gridRef.transaction((grid: Inventory) => {
    if (grid === null) return grid;
    Object.keys(currentPlacedLetters).map((itemId) => {
      delete grid[itemId];
    });
    return grid;
  });

  // Add items to inventory
  const inventoriesRef = db.ref(
    `activeGames/${gameId}/inventories/${playerId}`,
  );
  inventoriesRef.update(
    Object.entries(currentPlacedLetters).reduce<typeof currentPlacedLetters>(
      (obj, [key, value]) => {
        value.isPlaced = false;
        value.gridPosition = [];
        // Assign new ID
        const newKey = key.substring(0, 2) + uuidv4();
        value.itemId = newKey;
        obj[newKey] = value;
        return obj;
      },
      {},
    ),
  );
}
