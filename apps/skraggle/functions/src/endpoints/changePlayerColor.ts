import { db } from "../lib/firebaseAdmin";
import { getSessionData } from "../lib/sessionUtils";
import { z } from "zod";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import validateBody from "../lib/validateBody";

const colorSchema = z.object({
  color: z.string(),
});

export const changePlayerColor = onAuthorizedRequest(
  async (request, response) => {
    const validatedData = validateBody(request.body, colorSchema);
    const { color } = validatedData;

    const { gameId, playerId } = await getSessionData(request);
    const playerRef = db.ref(`activeGames/${gameId}/players/${playerId}/color`);
    await playerRef.set(color);

    response.send({ data: "Success" });
  },
);
