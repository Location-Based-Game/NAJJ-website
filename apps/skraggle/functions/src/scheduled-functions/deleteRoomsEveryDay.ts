import { onSchedule } from "firebase-functions/scheduler";
import { db } from "../lib/firebaseAdmin";
import { logger } from "firebase-functions";

// Manually run the task here https://console.cloud.google.com/cloudscheduler
export const deleteRoomsEveryDay = onSchedule(
  "every day 00:00",
  async () => {
    try {
      const gamesToDeleteRef = db.ref("gamesToDelete");
      const gameIds = (await gamesToDeleteRef.get()).val() as string[];
      if (!gameIds) {
        logger.info("No games to delete at this time.");
        return;
      }

      await Promise.all(
        gameIds.map(async (id) => {
          const gameRef = db.ref(`activeGames/${id}`);
          await gameRef.remove();
        }),
      );

      await gamesToDeleteRef.remove();

      logger.info("Inactive games successfully deleted");
    } catch (error) {
      logger.error(`${error}`);
    }
  },
);
