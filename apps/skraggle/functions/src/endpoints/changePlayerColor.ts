import { onRequest } from "firebase-functions/https";
import { db } from "../lib/firebaseAdmin";
import { deleteSession, getSessionData } from "../lib/sessionUtils";
import { z } from "zod";

const colorSchema = z.object({
  color: z.string(),
});

export const changePlayerColor = onRequest(
  { cors: true },
  async (request, response) => {
    response.set("Access-Control-Allow-Credentials", "true");

    try {
      const validatedData = colorSchema.safeParse(JSON.parse(request.body));

      if (!validatedData.success) {
        response.send({ error: "Invalid Data!" });
        return;
      }

      const { color } = validatedData.data;
      const { gameId, playerId } = await getSessionData(request);
      const playerRef = db.ref(
        `activeGames/${gameId}/players/${playerId}/color`,
      );
      await playerRef.set(color);

      response.send({ data: "Success" });
    } catch (error) {
      deleteSession(response);
      response.send({ error: `${error}` });
    }
  },
);
