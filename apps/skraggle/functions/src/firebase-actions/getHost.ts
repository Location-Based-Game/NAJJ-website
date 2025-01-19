import { db } from "../lib/firebaseAdmin";

export default async function getHost(gameId: string) {
  const hostRef = db.ref(`activeGames/${gameId}/host`);
  const snapshot = await hostRef.get();

  if (!snapshot.exists()) {
    throw new Error("Game not available!");
  } else {
    return snapshot.val() as string;
  }
}
