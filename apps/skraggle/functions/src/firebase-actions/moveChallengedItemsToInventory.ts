import { db } from "../lib/firebaseAdmin";
import { Inventory } from "../types";

export default async function moveChallengedItemsToInventory(
  gameId: string,
  playerId: string,
) {
  const currentPlacedLettersRef = db.ref(
    `activeGames/${gameId}/challengeWords/placedLetters`,
  );
  const currentPlacedLetters = (
    await currentPlacedLettersRef.get()
  ).val() as Inventory;

  // Remove items from grid
  const gridRef = db.ref(`activeGames/${gameId}/grid`);
  await Promise.all(
    Object.keys(currentPlacedLetters).map(async (itemId) => {
      await gridRef.child(itemId).remove();
    }),
  );

  // Add items to inventory
  const inventoriesRef = db.ref(
    `activeGames/${gameId}/inventories/${playerId}`,
  );
  inventoriesRef.update(
    Object.entries(currentPlacedLetters).reduce<typeof currentPlacedLetters>(
      (obj, [key, value]) => {
        value.isPlaced = false;
        value.gridPosition = [];
        obj[key] = value;
        return obj;
      },
      {},
    ),
  );
}
