import "server-only";
import { db } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import type { Inventories, ItemType, PlayersData } from "@/store/playersSlice";

type StartingDice = ItemType<{ diceValue: number }>;

export async function createTurnNumbers(gameId: string) {
  const playersRef = db.ref(`activeGames/${gameId}/players`);
  const players = await playersRef.get();
  if (!players.exists()) {
    throw new Error("No players in game!");
  }

  const inventoriesRef = db.ref(`activeGames/${gameId}/inventories`);
  const playerData = players.val() as PlayersData;
  const playerIds = Object.keys(playerData);

  const totalValues: number[] = [];
  const updates: Inventories = {};
  for (let i = 0; i < playerIds.length; i++) {
    const diceData = getDiceData(totalValues);
    totalValues.push(diceData.dice1 + diceData.dice2);

    const startingDice1: StartingDice = {
      type: "StartingDice",
      data: { diceValue: diceData.dice1 },
    };

    const startingDice2: StartingDice = {
      type: "StartingDice",
      data: { diceValue: diceData.dice2 },
    };

    updates[playerIds[i]] = {
      [`startingDice1-${uuidv4()}`]: startingDice1,
      [`startingDice2-${uuidv4()}`]: startingDice2,
    };
  }

  const turnValues = getSortedIndices(totalValues);
  playersRef.transaction((players: PlayersData) => {
    if (players === null) return players;
    for (const playerId in players) {
      if (players.hasOwnProperty(playerId)) {
        const index = Object.keys(players).indexOf(playerId);
        players[playerId].turn = turnValues[index];
      }
    }

    return players;
  });

  await inventoriesRef.update(updates);
}

function getSortedIndices(arr: number[]): number[] {
  const indices = arr.map((_, index) => index);
  // Sort the indices based on the values in the original array
  indices.sort((a, b) => arr[a] - arr[b]);

  // Create a result array that stores the rank of each number based on its sorted position
  const result: number[] = [];
  indices.forEach((index, sortedIndex) => {
    result[index] = sortedIndex;
  });

  return result;
}

function getDiceData(totalValues: number[]) {
  //get random values for 2 D6's
  let dice1 = 0;
  let dice2 = 0;

  function assignValues() {
    dice1 = getRandomInt(6);
    dice2 = getRandomInt(6);
    const total = dice1 + dice2;
    if (totalValues.includes(total)) {
      assignValues();
    }
  }
  assignValues();

  const diceData = {
    dice1,
    dice2,
  };

  return diceData;
}

function getRandomInt(max: number) {
  return Math.ceil(Math.random() * max);
}
