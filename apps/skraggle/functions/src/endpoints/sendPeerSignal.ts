import { onRequest } from "firebase-functions/https";
import { z } from "zod";
import { deleteSession, getSessionData } from "../lib/sessionUtils";
import { db } from "../lib/firebaseAdmin";
import { SignalData } from "simple-peer";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";

const sendPeerSignalSchema = z.object({
  isInitiator: z.boolean(),
  peerId: z.string().min(1),
  signal: z.custom<SignalData>(),
  name: z.string().min(1),
});

export const sendPeerSignal = onAuthorizedRequest(async (request, response) => {
  const validatedData = sendPeerSignalSchema.safeParse(
    JSON.parse(request.body),
  );

  if (!validatedData.success) {
    response.send({ error: "Invalid Data!" });
    return;
  }

  const { isInitiator, signal, peerId, name } = validatedData.data;

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
