import { serverTimestamp } from "firebase/database";
import { db, Reference } from "../lib/firebaseAdmin";
import { GameStates, PlayerData } from "../types";
import { GetLetterBlocks } from "../endpoints/setInventory";

export async function addPlayer(
  gameId: string,
  playerName: string,
): Promise<string> {
  const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
  const gameState = (await gameStateRef.get()).val() as GameStates;

  const playersRef = db.ref(`activeGames/${gameId}/players`);
  let playerId = "";

  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
  ) {
    const testPlayerRef = db.ref(
      `activeGames/${gameId}/players/testPlayer/name`,
    );
    await testPlayerRef.set(playerName);
    playerId = "testPlayer";
  } else {
    playerId = await addPlayerTransaction(playersRef, playerName);
  }

  //add player to webRTC peers list
  const signalingRef = db.ref(
    `activeGames/${gameId}/signaling/players/${playerId}`,
  );
  await signalingRef.set({
    name: playerName,
    signalStatus: "pending",
    timestamp: serverTimestamp(),
  });

  if (gameState === "Gameplay") {
    const inventoriesRef = db.ref(
      `activeGames/${gameId}/inventories/${playerId}`,
    );
    const letterBlocks = GetLetterBlocks({}, playerId);
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

async function addPlayerTransaction(playersRef: Reference, playerName: string) {
  let playerId = "";

  await playersRef.transaction(
    (currentPlayers: Record<string, PlayerData>) => {
      if (currentPlayers === null) {
        currentPlayers = {};
      }

      const playerCount = Object.keys(currentPlayers).length;
      if (playerCount >= 8) {
        throw new Error("Max players reached!");
      }

      const newPlayerRef = playersRef.push();
      if (newPlayerRef.key) {
        playerId = newPlayerRef.key;
        currentPlayers[playerId] = {
          name: playerName,
          color: pastelColors[playerCount],
          turn: playerCount,
          isOnline: true
        };
      } else {
        throw new Error("Player key not created");
      }

      return currentPlayers;
    },
  );

  return playerId;
}
