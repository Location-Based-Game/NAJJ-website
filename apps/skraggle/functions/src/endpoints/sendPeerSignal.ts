import { z } from "zod";
import { getSessionData } from "../lib/sessionUtils";
import { db } from "../lib/firebaseAdmin";
import { SignalData } from "simple-peer";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import validateBody from "../lib/validateBody";

const sendPeerSignalSchema = z.object({
  isInitiator: z.boolean(),
  peerId: z.string().min(1),
  signal: z.custom<SignalData>(),
  name: z.string().min(1),
});

export const sendPeerSignal = onAuthorizedRequest(async (request, response) => {
  const validatedData = validateBody(request.body, sendPeerSignalSchema);
  const { isInitiator, signal, peerId, name } = validatedData;

  const { gameId, playerId } = await getSessionData(request);

  if (isInitiator) {
    const offerRef = db.ref(
      `activeGames/${gameId}/signaling/${peerId}/peer-offer`,
    );
    await offerRef.set({ signal, playerId, name });
  } else {
    const answerRef = db.ref(
      `activeGames/${gameId}/signaling/${peerId}/peer-answer`,
    );
    await answerRef.set({ signal, playerId });
  }

  response.send({ data: gameId });
});
