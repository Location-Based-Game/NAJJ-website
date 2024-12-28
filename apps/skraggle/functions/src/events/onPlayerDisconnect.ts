import { onValueUpdated } from "firebase-functions/v2/database";
import { Inventory, PlayersData } from "../types";
import { db } from "../lib/firebaseAdmin";
import { logger } from "firebase-functions";
import { incrementTurn } from "../firebase-actions/incrementTurn";
import { transitionTurnsDiceRollToFirstTurn } from "../firebase-actions/transitionTurnsDiceRollToFirstTurn";

export const onPlayerDisconnect = onValueUpdated(
  {
    ref: "/activeGames/{gameId}/players/{playerId}/isOnline",
  },
  async (event) => {
    const isOnline = event.data.after.val() as boolean;
    const deleteRoomsRef = db.ref(`gamesToDelete`);
    const playerRef = event.data.after.ref.parent!;
    const allPlayersRef = playerRef.parent!;
    const gameIdRef = allPlayersRef.parent!.child("id");

    try {
      const gameId = (await gameIdRef.get()).val() as string;

      if (isOnline) {
        deleteRoomsRef.transaction((currentVal) => {
          if (currentVal === null) return [];
          return currentVal.filter((e: string) => e !== gameId);
        });
        return;
      }

      const playerId = (await playerRef.get()).key as string;
      //will increment turn if it is the current player's turn
      const {validTurn} = await incrementTurn(gameId, playerId)
      if (validTurn) {
        const currentPlacedLettersRef = db.ref(`activeGames/${gameId}/challengeWords/placedLetters`);
        const currentPlacedLetters = (await currentPlacedLettersRef.get()).val() as string[]
        const gridRef = db.ref(`activeGames/${gameId}/grid`);
        await Promise.all(currentPlacedLetters.map(async (itemId) => {
          await gridRef.child(itemId).remove();
        }))

        const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
        await challengeWordsRef.remove();
      }

      transitionTurnsDiceRollToFirstTurn(gameId)

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
  },
);
