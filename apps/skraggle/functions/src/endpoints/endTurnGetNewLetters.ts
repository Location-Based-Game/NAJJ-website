import { GameStates, Inventory } from "../../../types";
import { currentItemsSchema } from "../../../schemas/currentItemsSchema";
import { challengeWordsDataSchema } from "../../../schemas/challengerSchema";
import calculatePoints from "../firebase-actions/calculatePoints";
import { incrementTurn } from "../firebase-actions/incrementTurn";
import { db } from "../lib/firebaseAdmin";
import { getLetterBlocks } from "../lib/getLetterBlocks";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";
import validateBody from "../lib/validateBody";

export const endTurnGetNewLetters = onAuthorizedRequest(
  async (request, response) => {
    const validatedData = validateBody(request.body, currentItemsSchema);
    const { currentItems } = validatedData;

    const { gameId, playerId } = await getSessionData(request);

    const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
    const challengeWordsSnapshot = await challengeWordsRef.get()
    const challengeWordsData = challengeWordsDataSchema.parse(challengeWordsSnapshot.val());
    const { returnedLetters } = await calculatePoints(gameId, challengeWordsData);
    await challengeWordsRef.remove();

    // Get new letter blocks if the placed letters did not return to stand
    if (!returnedLetters) {
      const inventoriesRef = db.ref(
        `activeGames/${gameId}/inventories/${playerId}`,
      );
      const letterBlocks = getLetterBlocks(currentItems as Inventory, playerId);
      await inventoriesRef.set({ ...currentItems, ...letterBlocks });
    }

    // Lastly increment turn and transition to Gameplay state
    // Turn must be incremented after calculating points to resolve execution order issues on frontend
    const { validTurn, gameState } = await incrementTurn(gameId, playerId);
    const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
    if (validTurn && gameState === "FirstTurn" && !returnedLetters) {
      const newState: GameStates = "Gameplay";
      await gameStateRef.set(newState);
    }

    response.send({ data: "Success" });
  },
);
