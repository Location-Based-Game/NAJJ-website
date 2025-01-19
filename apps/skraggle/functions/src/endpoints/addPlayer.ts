import { z } from "zod";
import { getSessionData, setSessionCookie } from "../lib/sessionUtils";
import { db } from "../lib/firebaseAdmin";
import { addPlayer as addNewPlayer } from "../firebase-actions/addPlayer";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import validateBody from "../lib/validateBody";

const addPlayerSchema = z.object({
  playerName: z.string().min(1),
});

export const addPlayer = onAuthorizedRequest(async (request, response) => {
  const validatedData = validateBody<typeof addPlayerSchema>(
    request.body,
    addPlayerSchema,
  );

  const { playerName } = validatedData;
  const { gameId } = await getSessionData(request);

  //first check if room exists
  const snapshot = await db.ref(`activeGames/${gameId}`).get();
  if (!snapshot.exists()) {
    throw new Error("Game not available!");
  }

  const playerId = await addNewPlayer(gameId, playerName);
  await setSessionCookie(response, { playerName, playerId, gameId });

  response.send({ data: playerId });
});
