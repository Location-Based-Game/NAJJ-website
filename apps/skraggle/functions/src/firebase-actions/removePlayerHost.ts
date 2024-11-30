import removePlayer from "./removePlayer";
import { db } from "../lib/firebaseAdmin";
import { PlayersData } from "../types";

export default async function removePlayerHost(gameId: string, playerId: string) {
  await removePlayer(gameId, playerId);

  const gameRef = db.ref(`activeGames/${gameId}`);
  const playersRef = db.ref(`activeGames/${gameId}/players`);
  const players = await playersRef.get();

  if (players.exists()) {
    const playerData = players.val() as PlayersData;
    await gameRef.update({
      host: Object.keys(playerData)[0],
    });
  } else {
    await gameRef.remove();
  }
}
