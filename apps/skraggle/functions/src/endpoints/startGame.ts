import { deleteSession, getSessionData } from "../lib/sessionUtils";
import getHost from "../firebase-actions/getHost";
import setGameState from "../firebase-actions/setGameState";
import { createTurnNumbers } from "../firebase-actions/createTurnNumbers";
import * as logger from "firebase-functions/logger";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";

export const startGame = onAuthorizedRequest(async (request, response) => {
  const { gameId, playerId } = await getSessionData(request);

  const host = await getHost(gameId);
  if (host !== playerId) {
    const error = "Only the host can start the game";
    response.status(403).send({ error });
    deleteSession(response);
    logger.error(error);
    return;
  }

  await setGameState(gameId, "TurnsDiceRoll");
  await createTurnNumbers(gameId);

  response.send({ data: "Success" });
});
