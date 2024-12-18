import { incrementTurn } from "../firebase-actions/incrementTurn";
import { db } from "../lib/firebaseAdmin";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";
import { GameStates } from "../types";

export const endTurn = onAuthorizedRequest(async (request, response) => {
  const { gameId, playerId } = await getSessionData(request);
  const { validTurn, gameState } = await incrementTurn(gameId, playerId);

  const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
  if (validTurn && gameState === "FirstTurn") {
    const newState: GameStates = "Gameplay";
    await gameStateRef.set(newState);
  }

  response.send({ data: "Success" });
});
