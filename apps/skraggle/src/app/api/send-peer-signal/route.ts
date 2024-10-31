import { db } from "@/lib/firebaseAdmin";
import { deleteSession, getSessionData } from "@/lib/sessionUtils";
import { validateSearchParams } from "@/lib/validateSearchParams";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import type { SignalData } from "simple-peer";
import { z } from "zod";

const sendPeerSignalSchema = z.object({
  isInitiator: z.enum(["true", "false"]),
  peerId: z.string().min(1),
  signalString: z.string().min(1),
});

const signalSchema = z.custom<SignalData>();

//SEND PEER SIGNAL
export async function GET(request: NextRequest) {
  const { isInitiator, signalString, peerId } = validateSearchParams<
    z.infer<typeof sendPeerSignalSchema>
  >(request.url, sendPeerSignalSchema);

  const validatedSignal = signalSchema.safeParse(JSON.parse(signalString));
  if (!validatedSignal.success) {
    return NextResponse.json({ error: validatedSignal.error });
  }

  const signal = validatedSignal.data

  try {
    const { gameId, playerId } = await getSessionData();

    if (isInitiator === "true") {
      const offerRef = db.ref(
        `activeGames/${gameId}/signaling/${peerId}/peer-offer`,
      );
      await offerRef.set({ signal, playerId });
    } else {
      const answerRef = db.ref(
        `activeGames/${gameId}/signaling/${peerId}/peer-answer`,
      );
      await answerRef.set({ signal, playerId });
    }

    return NextResponse.json({ data: "Success" });
  } catch (error) {
    deleteSession();
    console.error(error)
    return NextResponse.json({ error: `${error}` });
  }
}
