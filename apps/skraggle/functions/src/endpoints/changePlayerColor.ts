import { onRequest } from "firebase-functions/https";
import { db } from "../lib/firebaseAdmin";
import { deleteSession, getSessionData } from "../lib/sessionUtils";
import { z } from "zod";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";

const colorSchema = z.object({
  color: z.string(),
});

export const changePlayerColor = onAuthorizedRequest(
  async (request, response) => {
    const validatedData = colorSchema.safeParse(JSON.parse(request.body));

    if (!validatedData.success) {
      response.send({ error: "Invalid Data!" });
      return;
    }

    const { color } = validatedData.data;
    const { gameId, playerId } = await getSessionData(request);
    const playerRef = db.ref(`activeGames/${gameId}/players/${playerId}/color`);
    await playerRef.set(color);

    response.send({ data: "Success" });
  },
);
