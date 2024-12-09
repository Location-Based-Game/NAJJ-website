import { onValueUpdated } from "firebase-functions/v2/database";
import { PlayersData } from "../types";
import { db } from "../lib/firebaseAdmin";
import { logger } from "firebase-functions";

export const onPlayerDisconnect = onValueUpdated(
  {
    ref: "/activeGames/{gameId}/players/{playerId}/isOnline",
  },
  async (event) => {
    const isOnline = event.data.after.val() as boolean;
    const deleteRoomsRef = db.ref(`gamesToDelete`);
    const playersRef = event.data.after.ref.parent!.parent!;
    const gameIdRef = playersRef.parent!.child("id");

    try {
      if (isOnline) {
        const gameId = (await gameIdRef.get()).val() as string;
        deleteRoomsRef.transaction((currentVal) => {
          if (currentVal === null) return [];
          return currentVal.filter((e: string) => e !== gameId);
        });
        return;
      }

      const playersData = (await playersRef.get()).val() as PlayersData;

      if (!Object.values(playersData).every((e) => !e.isOnline)) return;
      const gameId = (await gameIdRef.get()).val() as string;

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
