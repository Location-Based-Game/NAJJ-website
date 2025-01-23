import {
  submittedChallengeWordsSchema,
  ChallengeWordsData,
} from "../../../schemas/challengerSchema";
import { Inventory } from "../../../types";
import { moveInventoryItemToGrid } from "../firebase-actions/moveInventoryItemToGrid";
import { db } from "../lib/firebaseAdmin";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";
import validateBody from "../lib/validateBody";
import { ServerValue } from "firebase-admin/database";

export const COUNTDOWN_SECONDS = 12;

export const submitChallengeWords = onAuthorizedRequest(
  async (request, response) => {
    const validatedData = validateBody(
      request.body,
      submittedChallengeWordsSchema,
    );
    
    const { submittedChallengeWords, currentItems } = validatedData;
    const { gameId, playerId } = await getSessionData(request);

    const placedItems = Object.entries(currentItems).reduce<
      typeof currentItems
    >((obj, [key, value]) => {
      if (value.isPlaced) {
        obj[key] = value;
      }
      return obj;
    }, {});

    if (Object.keys(placedItems).length === 0) {
      throw new Error("No items placed!");
    }

    const data: ChallengeWordsData = {
      playerId,
      words: submittedChallengeWords,
      placedLetters: placedItems as Inventory,
      // Set timestamp to ensure a minimum amount of time as has passed before turn can end
      countdown: {
        startAt: ServerValue.TIMESTAMP,
        seconds: COUNTDOWN_SECONDS,
      },
    };

    const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
    await challengeWordsRef.set(data);

    await moveInventoryItemToGrid(gameId, playerId, currentItems as Inventory);

    response.send({ data: "Success" });
  },
);
