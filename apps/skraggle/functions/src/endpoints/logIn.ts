import { z } from "zod";
import { setSessionCookie } from "../lib/sessionUtils";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import validateBody from "../lib/validateBody";
import { createGameId } from "../lib/createGameId";

const logInSchema = z.object({
  gameId: z.string().length(4).nullable(),
});

export const logIn = onAuthorizedRequest(async (request, response) => {
  const validatedData = validateBody(request.body, logInSchema);
  response.clearCookie("__session");
  response.clearCookie("session_data");

  let { gameId } = validatedData;

  if (!gameId) {
    gameId = createGameId();
  }

  await setSessionCookie(response, {
    gameId,
    playerId: "",
    playerName: "",
  });

  response.send({ data: { gameId } });
});
