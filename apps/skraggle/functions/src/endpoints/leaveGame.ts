import { deleteSession, getSessionData } from "../lib/sessionUtils";
import getHost from "../firebase-actions/getHost";
import removePlayerHost from "../firebase-actions/removePlayerHost";
import removePlayer from "../firebase-actions/removePlayer";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";

export const leaveGame = onAuthorizedRequest(async (request, response) => {
  const { gameId, playerId } = await getSessionData(request);

  const host = await getHost(gameId);
  if (host === playerId) {
    await removePlayerHost(gameId, playerId);
  } else {
    await removePlayer(gameId, playerId);
  }

  deleteSession(response);
  response.send({ data: "Success" });
});
