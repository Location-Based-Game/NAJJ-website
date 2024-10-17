import { getSessionData } from "@/lib/sessionUtils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

  const { gameId, playerId } = await getSessionData();


}
