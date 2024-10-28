import "server-only"

import { gameIdSchema, GameIdType } from "@/schemas/gameIdSchema";
import { db } from "@/lib/firebaseAdmin";

export default async function deleteRoom(
  data: GameIdType,
) {
  const validatedData = gameIdSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  const { gameId } = validatedData.data;

  const gameRef = db.ref(`activeGames/${gameId}`);
  const snapshot = await gameRef.get();

  if (!snapshot.exists()) {
    throw new Error("Invalid Data!");
  }

  await gameRef.remove();
}
