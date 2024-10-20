import "server-only"
import { gameIdSchema, GameIdType } from "@/schemas/gameIdSchema";
import { db } from "@/lib/firebaseAdmin";

export default async function getHost(data: GameIdType) {
  const validatedData = gameIdSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId } = validatedData.data;

  const hostRef = db.ref(`activeGames/${gameId}/host`);
  const snapshot = await hostRef.get();

  if (!snapshot.exists()) {
    throw new Error("Game not available!");
  } else {
    return snapshot.val() as string;
  }
}
