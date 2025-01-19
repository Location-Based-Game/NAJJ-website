import { onValueUpdated } from "firebase-functions/v2/database";
import { db } from "../lib/firebaseAdmin";
import { logger } from "firebase-functions";
import { incrementTurn } from "../firebase-actions/incrementTurn";
import { transitionTurnsDiceRollToFirstTurn } from "../firebase-actions/transitionTurnsDiceRollToFirstTurn";
import moveChallengedItemsToInventory from "../firebase-actions/moveChallengedItemsToInventory";
import { PlayersData } from "../../../types";

const path = { ref: "/activeGames/{gameId}/players/{playerId}/isOnline" };
export const onPlayerDisconnect = onValueUpdated(path, async (event) => {
  const isOnline = event.data.after.val() as boolean;
  const deleteRoomsRef = db.ref("gamesToDelete");
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
    if (validTurn) {
      // If the player disconnects during their turn after they submitted their words
      // Remove the placed items from the grid and put them back into their inventory
      moveChallengedItemsToInventory(gameId, playerId)
      const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
      await challengeWordsRef.remove();
    }

    transitionTurnsDiceRollToFirstTurn(gameId);

    // If all players are offline, move room to list of rooms to delete
    const allPlayersData = (await allPlayersRef.get()).val() as PlayersData;
    if (!Object.values(allPlayersData).every((e) => !e.isOnline)) return;

    return deleteRoomsRef.transaction((currentVal) => {
      if (currentVal === null) return [gameId];
      currentVal.push(gameId);
      return currentVal;
    });
  } catch (error) {
    logger.error(`${error}`);
    return Promise.reject(error)
  }
});
