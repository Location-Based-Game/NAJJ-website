import { z } from "zod";
import { setSessionCookie } from "../lib/sessionUtils";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import validateBody from "../lib/validateBody";
import { createGameId } from "../lib/createGameId";
import { SESSION_SET_MESSAGE } from "../../../shared/constants";
import * as logger from "firebase-functions/logger"
import { decryptJWT } from "../lib/jwtUtils";

const logInSchema = z.object({
  gameId: z.string().length(4).nullable(),
});

export const logIn = onAuthorizedRequest(async (request, response) => {
  const validatedData = validateBody(request.body, logInSchema);
  response.clearCookie("__session");
  response.clearCookie("session_data");
  // Throw an error if a session already exists
  // const cookies = request.headers.cookie;
  // if (cookies) {
  //   const sessionCookie = cookies
  //     .split("; ")
  //     .find((row) => row.startsWith("__session="))
  //     ?.split("=")[1];

  //     if (sessionCookie) {
  //     const parsedData = await decryptJWT(sessionCookie);
  //     logger.log(parsedData)
  //     // Even when there are no cookies present on the client, this
  //     // is still being called
  //     response.status(400).send({ error: SESSION_SET_MESSAGE });
  //     return;
  //   }
  // }

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
