import { z } from "zod";
import color from "color-string";
import { validateSearchParams } from "@/lib/validateSearchParams";
import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getSessionData } from "@/lib/sessionUtils";
import { db } from "@/lib/firebaseAdmin";

function colorValidator(val: string) {
  try {
    return color.get(val) != null;
  } catch {
    return false;
  }
}

const colorSchema = z.object({
  color: z.string().refine(colorValidator),
});

//CHANGE PLAYER COLOR
export async function GET(request: NextRequest) {
  const { color } = validateSearchParams<z.infer<typeof colorSchema>>(
    request.url,
    colorSchema,
  );

  try {
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
