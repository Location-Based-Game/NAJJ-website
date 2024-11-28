import { onRequest } from "firebase-functions/https";
import { z } from "zod";
import { getSessionData, setSessionCookie } from "../lib/sessionUtils";
import { addPlayer } from "../firebase-actions/addPlayer";
import { db } from "../lib/firebaseAdmin";

const createRoomSchema = z.object({
  playerName: z.string().min(1),
});

export const createRoom = onRequest(
  { cors: true },
  async (request, response) => {
    response.set("Access-Control-Allow-Credentials", "true");

    try {
      const validatedData = createRoomSchema.safeParse(
        JSON.parse(request.body),
      );

      if (!validatedData.success) {
        response.send({ error: "Invalid Data!" });
        return;
      }

      const { playerName } = validatedData.data;
      const { gameId } = await getSessionData(request);
      const gameRoomData = {
        id: gameId,
        gameState: "Menu",
        currentTurn: 0,
      };

      await db.ref(`activeGames/${gameId}`).set(gameRoomData);

      const playerId = await addPlayer(gameId, playerName);

      await db.ref(`activeGames/${gameId}/host`).set(playerId);

      await setSessionCookie(response, { playerName, playerId, gameId });

      response.send({ data: gameId });
    } catch (error) {
      response.send({ error: `${error}` });
    }
  },
);
