import { onRequest } from "firebase-functions/https";
import { getSessionData, deleteSession } from "../lib/sessionUtils";
import getHost from "../firebase-actions/getHost";
import setGameState from "../firebase-actions/setGameState";
import { createTurnNumbers } from "../firebase-actions/createTurnNumbers";

export const startGame = onRequest(
  { cors: true },
  async (request, response) => {
    response.set("Access-Control-Allow-Credentials", "true");

    try {
      const { gameId, playerId } = await getSessionData(request);

      const host = await getHost(gameId);
      if (host !== playerId) {
        response
          .status(403)
          .send({ error: "Only the host can start the game" });
        return;
      }

      await setGameState(gameId, "TurnsDiceRoll");
      await createTurnNumbers(gameId);

      response.send({ data: "Success" });
    } catch (error) {
      deleteSession(response);
      response.send({ error: `${error}` });
    }
  },
);
