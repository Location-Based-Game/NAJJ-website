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

  const totalValues:number[] = []
  const updates: PlayersData = {};
  for (let i = 0; i < playerIds.length; i++) {
    const diceData = getDiceData(totalValues)
    totalValues.push(diceData.dice1 + diceData.dice2)
    updates[playerIds[i]] = {...playerData[playerIds[i]], diceData};
  }

  const turnValues = getSortedIndices(totalValues)
  Object.keys(updates).forEach((key, i) => {
    updates[key].turn = turnValues[i]
  })

  await playersRef.update(updates);
}

function getSortedIndices(arr: number[]): number[] {
  const indices = arr.map((_, index) => index);
  // Sort the indices based on the values in the original array
  indices.sort((a, b) => arr[a] - arr[b]);

  // Create a result array that stores the rank of each number based on its sorted position
  const result:number[] = [];
  indices.forEach((index, sortedIndex) => {
      result[index] = sortedIndex + 1;
  });

  return result;
}

function getDiceData(totalValues:number[]): InitialDiceData {
  //get random values for 2 D6's
  let dice1 = 0;
  let dice2 = 0;

  function assignValues() {
    dice1 = getRandomInt(6)
    dice2 = getRandomInt(6)
    const total = dice1 + dice2;
    if (totalValues.includes(total)) {
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
