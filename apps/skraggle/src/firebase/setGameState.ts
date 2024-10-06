import { rtdb } from "@/app/firebaseConfig";
import { GameStates } from "@/state/GameStateSlice";
import { ref, set } from "firebase/database";

export default async function setGameState(code: string | null, state: GameStates) {
  if (!code) {
    throw new Error("invalid code!");
  }

  const gameStateRef = ref(rtdb, `activeGames/${code}/gameState`);
  await set(gameStateRef, state);
}
