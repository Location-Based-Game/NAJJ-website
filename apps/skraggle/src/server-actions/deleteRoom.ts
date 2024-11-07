import "server-only"

import { db } from "@/lib/firebaseAdmin";

export default async function deleteRoom(gameId:string) {
  const gameRef = db.ref(`activeGames/${gameId}`);
  const snapshot = await gameRef.get();

  if (!snapshot.exists()) {
    throw new Error("Invalid Data!");
  }

  await gameRef.remove();
}
