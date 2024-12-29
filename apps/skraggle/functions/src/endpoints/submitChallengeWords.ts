import { moveInventoryItemToGrid } from "../firebase-actions/moveInventoryItemToGrid";
import { db } from "../lib/firebaseAdmin";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";
import { submittedChallengeWordsSchema } from "../schemas/challengeWordSchema";
import { Inventory } from "../types";

export const submitChallengeWords = onAuthorizedRequest(
  async (request, response) => {
    const validatedData = submittedChallengeWordsSchema.safeParse(
      JSON.parse(request.body),
    );
    if (!validatedData.success) {
      response.send({ error: "Invalid Data!" });
      return;
    }
    const { submittedChallengeWords, currentItems } = validatedData.data;

    const { gameId, playerId } = await getSessionData(request);
    const challengeWordsRef = db.ref(
      `activeGames/${gameId}/challengeWords/words`,
    );
    await challengeWordsRef.set(submittedChallengeWords);

    const currentPlacedLettersRef = db.ref(
      `activeGames/${gameId}/challengeWords/placedLetters`,
    );
    
    const placedItems = Object.entries(currentItems).reduce<
      typeof currentItems
    >((obj, [key, value]) => {
      if (value.isPlaced) {
        obj[key] = value;
      }
      return obj;
    }, {});

    currentPlacedLettersRef.set(placedItems);

    await moveInventoryItemToGrid(gameId, playerId, currentItems as Inventory);

    response.send({ data: "Success" });
  },
);
