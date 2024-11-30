import { onRequest } from "firebase-functions/https";
import { deleteSession, getSessionData } from "../lib/sessionUtils";
import getHost from "../firebase-actions/getHost";
import removePlayerHost from "../firebase-actions/removePlayerHost";
import removePlayer from "../firebase-actions/removePlayer";

export const leaveGame = onRequest(
  { cors: true },
  async (request, response) => {
    response.set("Access-Control-Allow-Credentials", "true");

    try {
      const { gameId, playerId } = await getSessionData(request);

      const host = await getHost(gameId);
      if (host === playerId) {
        await removePlayerHost(gameId, playerId);
      } else {
        await removePlayer(gameId, playerId);
      }

      deleteSession(response);
      response.send({ data: "Success" });
    } catch (error) {
      deleteSession(response);
      response.send({ error: `${error}` });
    }
  },
);
