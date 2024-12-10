import { incrementTurn } from "../firebase-actions/incrementTurn";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";

export const endTurn = onAuthorizedRequest(async (request, response) => {
  const { gameId, playerId } = await getSessionData(request);
  await incrementTurn(gameId, playerId);

  response.send({ data: "Success" });
});
