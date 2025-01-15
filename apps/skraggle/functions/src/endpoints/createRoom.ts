import { z } from "zod";
import { getSessionData, setSessionCookie } from "../lib/sessionUtils";
import { addPlayer } from "../firebase-actions/addPlayer";
import { db } from "../lib/firebaseAdmin";
import validateBody from "../lib/validateBody";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { createRoomData } from "../firebase-actions/createRoomData";

const createRoomSchema = z.object({
  playerName: z.string().min(1),
});

export const createRoom = onAuthorizedRequest(async (request, response) => {
  const validatedData = validateBody<typeof createRoomSchema>(
    request.body,
    createRoomSchema,
  );

  const { playerName } = validatedData;
  const { gameId } = await getSessionData(request);
  await createRoomData(gameId);

  const playerId = await addPlayer(gameId, playerName);

  await db.ref(`activeGames/${gameId}/host`).set(playerId);

  await setSessionCookie(response, { playerName, playerId, gameId });

  response.send({ data: playerId });
});
