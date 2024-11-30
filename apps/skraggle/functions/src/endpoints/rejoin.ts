import { onRequest } from "firebase-functions/https";
import { deleteSession, getSessionData } from "../lib/sessionUtils";
import getHost from "../firebase-actions/getHost";
import { db } from "../lib/firebaseAdmin";
import { serverTimestamp } from "firebase/database";

export const rejoin = onRequest({ cors: true }, async (request, response) => {
  response.set("Access-Control-Allow-Credentials", "true");

  try {
    const { gameId, playerId, playerName } = await getSessionData(request);

    const host = await getHost(gameId);

    //remove signaling data to reestablish webRTC peers
    const playerSignalingRef = db.ref(
      `activeGames/${gameId}/signaling/${playerId}`,
    );
    await playerSignalingRef.remove();
    const playerRef = db.ref(
      `activeGames/${gameId}/signaling/players/${playerId}`,
    );
    await playerRef.set({
      signalStatus: "pending",
      name: playerName,
      timestamp: serverTimestamp(),
    });

    if (!playerId) {
      throw new Error("No playerId assigned!");
    }

    if (host === playerId) {
      response.send({
        data: { gameId, playerId, playerName, isHost: true },
      });
      return;
    }

    response.send({
      data: { gameId, playerId, playerName },
    });
  } catch (error) {
    deleteSession(response);
    response.send({ error: `${error}` });
  }
});
