import { onValueUpdated } from "firebase-functions/v2/database";
import { GameStates, PlayerData, PlayersData } from "../types";
import { db } from "../lib/firebaseAdmin";
import { logger } from "firebase-functions";
import { incrementTurn } from "../firebase-actions/incrementTurn";
import { transitionTurnsDiceRollToGameplay } from "../firebase-actions/transitionTurnsDiceRollToGameplay";

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
      await incrementTurn(gameId, playerId)

      transitionTurnsDiceRollToGameplay(gameId)

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
