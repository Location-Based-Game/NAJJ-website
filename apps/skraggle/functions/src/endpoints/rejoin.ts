import { getSessionData } from "../lib/sessionUtils";
import getHost from "../firebase-actions/getHost";
import { db } from "../lib/firebaseAdmin";
import { ServerValue } from "firebase-admin/database";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";

export const rejoin = onAuthorizedRequest(async (request, response) => {
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
    timestamp: ServerValue.TIMESTAMP,
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
});
