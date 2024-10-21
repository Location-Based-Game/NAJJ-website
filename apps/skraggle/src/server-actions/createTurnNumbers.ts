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

  const turnValues:number[] = []
  const updates: any = {};
  for (let i = 0; i < playerIds.length; i++) {
    const diceData = getDiceData(turnValues)
    turnValues.push(diceData.dice1 + diceData.dice2)
    updates[`${playerIds[i]}`] = {...playerData[playerIds[i]], diceData};
  }

  await playersRef.update(updates);
}

function getDiceData(turnValues:number[]): InitialDiceData {
  //get random values for 2 D6's
  let dice1 = 0;
  let dice2 = 0;

  function assignValues() {
    dice1 = getRandomInt(6)
    dice2 = getRandomInt(6)
    const total = dice1 + dice2;
    if (turnValues.includes(total)) {
      assignValues()
    }
  }

  assignValues()

  const diceData: InitialDiceData = {
    dice1,
    dice2
  };

  return diceData
}

function getRandomInt(max:number) {
  return Math.ceil(Math.random() * max)
}
