import "server-only";
import { playerIdSchema, PlayerIdType } from "@/schemas/playerIdSchema";
import { db } from "@/lib/firebaseAdmin";

export default async function removePlayer(data: PlayerIdType) {
  const validatedData = playerIdSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId, playerId } = validatedData.data;

  const playersRef = db.ref(`activeGames/${gameId}/players/${playerId}`);
  await playersRef.remove();
}
