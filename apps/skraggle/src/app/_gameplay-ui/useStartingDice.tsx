import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import type { RootState } from "@/store/store";
import { type PlayersData } from "@/store/playersSlice";

//DELETE THIS
export default function useStartingDice() {
  const { isGameActive, state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const { callUnityFunction } = useUnityReactContext();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const isStartingDiceSet = useRef(false);
  const players = useSelector((state: RootState) => state.players);

  useEffect(() => {
    if (!isGameActive) {
      isStartingDiceSet.current = false;
      return;
    };
    if (!gameId) return;
    if (isStartingDiceSet.current) return;
    // if (!players[playerId].inventory) return;

    // Object.keys(players).forEach((key) => {
    //   SpawnItems(players, key);
    // });

    isStartingDiceSet.current = true;
  }, [isGameActive, gameId, players, gameState]);

  // function SpawnItems(players: PlayersData, key: string) {
  //   const inventory = players[key].inventory;
  //   if (!inventory) return;
  //   Object.keys(inventory).forEach((itemId) => {
  //     const itemData = {
  //       playerId: key,
  //       itemId,
  //       data: JSON.stringify(inventory[itemId].data),
  //       type: inventory[itemId].type,
  //     }
  //     callUnityFunction("SpawnItem", itemData);
  //   });
  // }
}
