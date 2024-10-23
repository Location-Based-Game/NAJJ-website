import { db } from "@/lib/firebaseAdmin";
import { getSessionData } from "@/lib/sessionUtils";
import { validateSearchParams } from "@/lib/validateSearchParams";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import type { SignalData } from "simple-peer";
import { z } from "zod";

const sendPeerSignalSchema = z.object({
  isInitiator: z.enum(["true", "false"]),
  peerId: z.string().min(1),
  signal: z.string().min(1),
});

const signalSchema = z.custom<SignalData>();

//SEND PEER SIGNAL
export async function GET(request: NextRequest) {
  const { isInitiator, signal, peerId } = validateSearchParams<
    z.infer<typeof sendPeerSignalSchema>
  >(request.url, sendPeerSignalSchema);

  const validatedSignal = signalSchema.parse(JSON.parse(signal));

  const { gameId, playerId } = await getSessionData();

  if (isInitiator === "true") {
    const offerRef = db.ref(
      `activeGames/${gameId}/players/${peerId}/peer-offer`,
    );
    offerRef.set({ signal: validatedSignal, playerId });
  } else {
    const answerRef = db.ref(
      `activeGames/${gameId}/players/${peerId}/peer-answer`,
    );
    answerRef.set({ signal: validatedSignal, playerId });
  }

  return NextResponse.json({ data: "Success" });
}
