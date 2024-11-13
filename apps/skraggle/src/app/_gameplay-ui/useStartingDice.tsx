import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { useGetPlayers, type PlayersData } from "@/components/PlayersDataProvider";
import type { RootState } from "@/store/store";

export default function useStartingDice() {
  const { isGameActive, state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const { callUnityFunction } = useUnityReactContext();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const isStartingDiceSet = useRef(false);
  const { playerData } = useGetPlayers();

  useEffect(() => {
    if (!isGameActive) {
      isStartingDiceSet.current = false;
      return;
    };
    if (!gameId) return;
    if (isStartingDiceSet.current) return;
    if (!playerData[playerId].inventory) return;

    Object.keys(playerData).forEach((key) => {
      SpawnItems(playerData, key);
    });

    isStartingDiceSet.current = true;
  }, [isGameActive, gameId, playerData, gameState]);

  function SpawnItems(players: PlayersData, key: string) {
    const inventory = players[key].inventory;
    if (!inventory) return;
    Object.keys(inventory).forEach((itemId) => {
      callUnityFunction("SpawnItem", {
        playerId: key,
        itemId,
        data: JSON.stringify(inventory[itemId].data),
        type: inventory[itemId].type,
      });
    });
  }
}
