import { push, ref, runTransaction, set } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";

export async function addPlayer(code: string | null, name: string): Promise<string> {
  if (!code) {
    throw new Error("invalid code!");
  }
  
  const playersRef = ref(rtdb, `activeGames/${code}/players`);
  let playerKey = "";

  await runTransaction(playersRef, (currentPlayers) => {
    if (currentPlayers === null) {
      currentPlayers = {};
    }

    const playerCount = Object.keys(currentPlayers).length;
    if (playerCount >= 8) {
      throw new Error("Max players reached!");
    }

    const newPlayerRef = push(playersRef);
    if (newPlayerRef.key) {
      playerKey = newPlayerRef.key;
      currentPlayers[playerKey] = name;
    } else {
      throw new Error("Player key not created");
    }

    return currentPlayers;
  });

  return playerKey;
}

export async function addTestPlayer(
  code: string | null,
  name: string,
): Promise<string> {
  if (!code) {
    throw new Error("invalid code!");
  }

  const playersRef = ref(rtdb, `activeGames/${code}/players/testPlayer`);
  await set(playersRef, name);
  return "testPlayer";
}
