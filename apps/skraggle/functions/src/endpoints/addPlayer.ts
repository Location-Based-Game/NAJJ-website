import { onRequest } from "firebase-functions/https";
import { z } from "zod";
import { deleteSession, getSessionData, setSessionCookie } from "../lib/sessionUtils";
import { db } from "../lib/firebaseAdmin";
import { addPlayer as addNewPlayer } from "../firebase-actions/addPlayer";

const addPlayerSchema = z.object({
  playerName: z.string().min(1),
});

export const addPlayer = onRequest(
  { cors: true },
  async (request, response) => {
    response.set("Access-Control-Allow-Credentials", "true");

    try {
      const validatedData = addPlayerSchema.safeParse(JSON.parse(request.body));

      if (!validatedData.success) {
        response.send({ error: "Invalid Data!" });
        return;
      }

      const { playerName } = validatedData.data;

      const { gameId } = await getSessionData(request);

      //first check if room exists
      const snapshot = await db.ref(`activeGames/${gameId}`).get();
      if (!snapshot.exists()) {
        throw new Error("Game not available!");
      }

      const playerId = await addNewPlayer(gameId, playerName);
      await setSessionCookie(response, { playerName, playerId, gameId });

      response.send({ data: playerId });
    } catch (error) {
      deleteSession(response);
      response.send({ error: `${error}` });
    }
  },
);
