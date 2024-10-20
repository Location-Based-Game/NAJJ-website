import "server-only"
import { db } from "@/lib/firebaseAdmin";
import { PlayersData, InitialDiceData } from "@/components/GetPlayers";

export async function createTurnNumbers(gameId:string) {
  const playersRef = db.ref(`activeGames/${gameId}/players`);
  const players = await playersRef.get();
  if (!players.exists()) {
    throw new Error("No players in game!")
  }

  const playerData = players.val() as PlayersData
  const playerIds = Object.keys(playerData)

  const updates: any = {};
  for (let i = 0; i < playerIds.length; i++) {
    const diceData: InitialDiceData = {
      dice1: 1 + i,
      dice2: 1 + i,
    };

    updates[`${playerIds[i]}`] = {...playerData[playerIds[i]], diceData};
  }

  await playersRef.update(updates);
}
