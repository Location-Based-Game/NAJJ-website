import { z } from "zod";
import { setSessionCookie } from "../lib/sessionUtils";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import validateBody from "../lib/validateBody";
import { createGameId } from "../lib/createGameId";
import { SESSION_SET_MESSAGE } from "../../../shared/constants";

const logInSchema = z.object({
  gameId: z.string().length(4).nullable(),
});

export const logIn = onAuthorizedRequest(async (request, response) => {
  const validatedData = validateBody(request.body, logInSchema);

  // Throw an error if a session already exists
  const cookies = request.headers.cookie;
  if (cookies) {
    const sessionCookie = cookies
      .split("; ")
      .find((row) => row.startsWith("__session="))
      ?.split("=")[1];

    if (sessionCookie) {
      response.status(400).send({ error: SESSION_SET_MESSAGE });
      return;
    }
  }

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
