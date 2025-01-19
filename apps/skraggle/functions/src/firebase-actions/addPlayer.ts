import { db } from "../lib/firebaseAdmin";
import { GameStates, PlayerData } from "../types";
import { getLetterBlocks } from "../lib/getLetterBlocks";
import { ServerValue } from "firebase-admin/database";

export async function addPlayer(
  gameId: string,
  playerName: string,
): Promise<string> {
  const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
  const gameState = (await gameStateRef.get()).val() as GameStates;
  const playerId = await addPlayerTransaction(gameId, playerName);

  //add player to webRTC peers list
  const signalingRef = db.ref(
    `activeGames/${gameId}/signaling/players/${playerId}`,
  );
  await signalingRef.set({
    name: playerName,
    signalStatus: "pending",
    timestamp: ServerValue.TIMESTAMP
  });

  //get letter blocks if joining during Gameplay or FirstTurn states
  if (gameState === "Gameplay" || gameState === "FirstTurn") {
    const inventoriesRef = db.ref(
      `activeGames/${gameId}/inventories/${playerId}`,
    );
    const letterBlocks = getLetterBlocks({}, playerId);
    await inventoriesRef.set(letterBlocks);
  }

  return playerId;
}

const pastelColors: string[] = [
  "#91a2ff", // Light blue
  "#f491ff", // Light pink
  "#91ff95", // Light green
  "#ff919c", // Light red
  "#fff691", // Light yellow
  "#c591ff", // Light purple
  "#ffba91", // Light orange
  "#91ffd1", // Light mint
];

async function addPlayerTransaction(gameId: string, playerName: string) {
  let playerId = "";
  let errorMessage = "";
  const playersRef = db.ref(`activeGames/${gameId}/players`);
  await playersRef.transaction(
    (currentPlayers: Record<string, PlayerData> | null) => {
      if (currentPlayers === null) {
        currentPlayers = {};
      }

      const playerCount = Object.keys(currentPlayers).length;
      if (playerCount >= 8) {
        errorMessage = "Max players reached!";
        return null;
      }

      const newPlayerRef = playersRef.push();
      if (newPlayerRef.key) {
        playerId = newPlayerRef.key;
        currentPlayers[playerId] = {
          name: playerName,
          color: pastelColors[playerCount],
          turn: playerCount,
          isOnline: true,
          points: 0,
        };
      } else {
        errorMessage = "Player key not created";
        return null;
      }

      return currentPlayers;
    },
  );

  if (!errorMessage) {
    return playerId;
  } else {
    throw new Error(errorMessage);
  }
}
