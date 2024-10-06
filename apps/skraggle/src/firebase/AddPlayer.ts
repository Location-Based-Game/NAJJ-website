import { push, ref, runTransaction, set } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";

export async function AddPlayer(code: string, name: string) {
  const playersRef = ref(rtdb, `activeGames/${code}/players`);
  let playerKey = ""

  await runTransaction(playersRef, (currentPlayers) => {
    if (currentPlayers === null) {
      currentPlayers = {}
    }

    const playerCount = Object.keys(currentPlayers).length;
    if (playerCount >= 8) {
      Promise.reject("Max players reached!")
      return;
    }

    const newPlayerRef = push(playersRef);
    if (newPlayerRef.key) {
      playerKey = newPlayerRef.key
      currentPlayers[playerKey] = name;
    }
    else {
      Promise.reject("Player key not created")
    }

    return currentPlayers
  })

  return playerKey;
}

export async function AddTestPlayer(code: string, name: string) {
  const playersRef = ref(rtdb, `activeGames/${code}/players/testPlayer`);
  await set(playersRef, name);
  return "testPlayer"
}
