import "server-only"
import removePlayer from "./removePlayer";
import { PlayersType } from "@/components/GetPlayers";
import { PlayerIdType, playerIdSchema } from "@/schemas/playerIdSchema";
import { db } from "@/lib/firebaseAdmin";

export default async function removePlayerHost(data: PlayerIdType) {
  const validatedData = playerIdSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  await removePlayer(data);

  const { gameId } = validatedData.data;

  const gameRef = db.ref(`activeGames/${gameId}`);
  const playersRef = db.ref(`activeGames/${gameId}/players`);
  const players = await playersRef.get();

  if (players.exists()) {
    const playerData = players.val() as PlayersType;
    await gameRef.update({
      host: Object.keys(playerData)[0],
    });
  } else {
    await gameRef.remove();
  }
}
