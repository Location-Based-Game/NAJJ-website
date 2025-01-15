import { z } from "zod";
import { getSessionData, setSessionCookie } from "../lib/sessionUtils";
import { addPlayer } from "../firebase-actions/addPlayer";
import { db } from "../lib/firebaseAdmin";
import { GameRoom } from "../types";
import validateBody from "../lib/validateBody";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";

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
  const gameRoomData: GameRoom = {
    id: gameId,
    gameState: "Menu",
    currentTurn: 0,
    players: {},
    inventories: {},
    grid: {},
  };

  await db.ref(`activeGames/${gameId}`).set(gameRoomData);

  const playerId = await addPlayer(gameId, playerName);

  await db.ref(`activeGames/${gameId}/host`).set(playerId);

  await setSessionCookie(response, { playerName, playerId, gameId });

  response.send({ data: playerId });
});
