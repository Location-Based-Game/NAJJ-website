import { onValueUpdated } from "firebase-functions/v2/database";
import { Inventory, PlayersData } from "../types";
import { db } from "../lib/firebaseAdmin";
import { logger } from "firebase-functions";
import { incrementTurn } from "../firebase-actions/incrementTurn";
import { transitionTurnsDiceRollToFirstTurn } from "../firebase-actions/transitionTurnsDiceRollToFirstTurn";

const path = { ref: "/activeGames/{gameId}/players/{playerId}/isOnline" };
export const onPlayerDisconnect = onValueUpdated(path, async (event) => {
  const isOnline = event.data.after.val() as boolean;
  const deleteRoomsRef = db.ref(`gamesToDelete`);
  const playerRef = event.data.after.ref.parent!;
  const allPlayersRef = playerRef.parent!;
  const gameIdRef = allPlayersRef.parent!.child("id");

  try {
    const gameId = (await gameIdRef.get()).val() as string;

    // If at least 1 player is online, remove the room from list of rooms to delete
    if (isOnline) {
      deleteRoomsRef.transaction((currentVal) => {
        if (currentVal === null) return [];
        return currentVal.filter((e: string) => e !== gameId);
      });
      return;
    }

    const playerId = (await playerRef.get()).key as string;
    // Will increment turn if it is the current player's turn
    const { validTurn } = await incrementTurn(gameId, playerId);
    if (validTurn) moveItems(gameId, playerId);

    transitionTurnsDiceRollToFirstTurn(gameId);

    // If all players are offline, move room to list of rooms to delete
    const allPlayersData = (await allPlayersRef.get()).val() as PlayersData;
    if (!Object.values(allPlayersData).every((e) => !e.isOnline)) return;

    deleteRoomsRef.transaction((currentVal) => {
      if (currentVal === null) return [gameId];
      currentVal.push(gameId);
      return currentVal;
    });
  } catch (error) {
    logger.error(`${error}`);
  }
});

/**
 * If the player disconnects during their turn after they submitted their words
 * Remove the placed items from the grid and put them back into their inventory
 */
async function moveItems(gameId: string, playerId: string) {
  const currentPlacedLettersRef = db.ref(
    `activeGames/${gameId}/challengeWords/placedLetters`,
  );
  const currentPlacedLetters = (
    await currentPlacedLettersRef.get()
  ).val() as Inventory;
  const gridRef = db.ref(`activeGames/${gameId}/grid`);
  await Promise.all(
    Object.keys(currentPlacedLetters).map(async (itemId) => {
      await gridRef.child(itemId).remove();
    }),
  );

  const inventoriesRef = db.ref(
    `activeGames/${gameId}/inventories/${playerId}`,
  );
  inventoriesRef.update(
    Object.entries(currentPlacedLetters).reduce<typeof currentPlacedLetters>(
      (obj, [key, value]) => {
        value.isPlaced = false;
        value.gridPosition = []
        obj[key] = value;
        return obj;
      },
      {},
    ),
  );
  
  const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
  await challengeWordsRef.remove();
}
