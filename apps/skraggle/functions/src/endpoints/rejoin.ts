import { getSessionData } from "../lib/sessionUtils";
import getHost from "../firebase-actions/getHost";
import { db } from "../lib/firebaseAdmin";
import { ServerValue } from "firebase-admin/database";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { RejoinSchemaType } from "../../../schemas/rejoinSchema";

export const rejoin = onAuthorizedRequest(async (request, response) => {
  const { gameId, playerId, playerName } = await getSessionData(request);
  // First check if game exists (inside of getHost)
  const host = await getHost(gameId);

  // Remove signaling data to reestablish webRTC peers
  const playerSignalingRef = db.ref(
    `activeGames/${gameId}/signaling/${playerId}`,
  );
  await playerSignalingRef.remove();
  // Reset signaling status
  const playerSignalingStatusRef = db.ref(
    `activeGames/${gameId}/signaling/players/${playerId}`,
  );
  await playerSignalingStatusRef.set({
    signalStatus: "pending",
    name: playerName,
    timestamp: ServerValue.TIMESTAMP,
  });

  if (!playerId) {
    throw new Error("No playerId assigned!");
  }

  const data: RejoinSchemaType = {
    gameId,
    playerId,
    playerName,
    isHost: host === playerId,
  };

  response.send({ data });
});
