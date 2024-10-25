import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "./UnityContext";
import type { PlayersData } from "@/components/GetPlayers";
import type { RootState } from "@/store/store";

export default function useStartingDice(players: PlayersData) {
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const { callUnityFunction } = useUnityReactContext();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);

  const isStartingDiceSet = useRef(false);

  useEffect(() => {
    if (!isGameActive) return;
    if (!gameId) return;
    if (isStartingDiceSet.current) return;
    if (!players[playerId].inventory) return;

    //Players must be added first so Main Player != null
    Object.keys(players).forEach((key) => {
      SpawnPlayer(players, key);
    });

    Object.keys(players).forEach((key) => {
      AddDice(players, key);
    });

    isStartingDiceSet.current = true;
  }, [isGameActive, gameId, players]);

  function SpawnPlayer(players: PlayersData, key: string) {
    const { turn } = players[key];
    callUnityFunction("AddPlayer", {
      turn,
      playerId: key,
      isMainPlayer: key === playerId,
    });
  }

  function AddDice(players: PlayersData, key: string) {
    const inventory = players[key].inventory;
    Object.keys(inventory).forEach((itemId) => {
      callUnityFunction("CreateStartingDice", {
        playerId: key,
        value: inventory[itemId].data,
      });
    });
  }
}
