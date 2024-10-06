import { rtdb } from "@/app/firebaseConfig";
import { GameStates } from "@/state/GameStateSlice";
import { ref, set } from "firebase/database";

export type PlayerData = string;

export type InitialDiceData = {
  dice1: number;
  dice2: number;
};

export type GameRoom = {
  name: string;
  gameState: GameStates;
  players: PlayerData | null;
  turnOrder: string[] | null;
  initialDiceData: InitialDiceData | null;
  currentTurn: number;
};

export default async function CreateRoom(code: string) {
  const data: GameRoom = {
    name: code,
    gameState: "Menu",
    players: null,
    turnOrder: [],
    initialDiceData: null,
    currentTurn: 0,
  };

  await set(ref(rtdb, `activeGames/${code}`), data);
}
