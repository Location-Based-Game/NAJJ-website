import { z } from "zod";
import { validateSearchParams } from "@/lib/validateSearchParams";
import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getSessionData } from "@/lib/sessionUtils";
import { db } from "@/lib/firebaseAdmin";

const colorSchema = z.object({
  color: z.string()
});

//CHANGE PLAYER COLOR
export async function GET(request: NextRequest) {  
  try {
    const { color } = validateSearchParams<z.infer<typeof colorSchema>>(
      request.url,
      colorSchema,
    );
    const { gameId, playerId } = await getSessionData();
    const playerRef = db.ref(`activeGames/${gameId}/players/${playerId}/color`);
    await playerRef.set(color);

    return NextResponse.json({ data: "Success" });
  } catch (error) {
    deleteSession();
    console.error(error);
    return NextResponse.json({ error: `${error}` });
  }
}
