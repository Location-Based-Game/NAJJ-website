import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import type { PlayersData } from "@/components/PlayersDataProvider";
import type { RootState } from "@/store/store";
import { setPlayerTurn } from "@/store/turnSlice";

export default function useStartingDice(players: PlayersData) {
  const { isGameActive, state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const { callUnityFunction } = useUnityReactContext();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const dispatch = useDispatch();
  const isStartingDiceSet = useRef(false);

  useEffect(() => {
    if (!isGameActive) {
      isStartingDiceSet.current = false;
      return;
    };
    if (!gameId) return;
    if (isStartingDiceSet.current) return;
    if (!players[playerId].inventory) return;

    //Players must be added first so Main Player != null
    Object.keys(players).forEach((key) => {
      SpawnPlayer(players, key);
    });

    Object.keys(players).forEach((key) => {
      SpawnItems(players, key);
    });

    dispatch(setPlayerTurn(players[playerId].turn));

    isStartingDiceSet.current = true;
  }, [isGameActive, gameId, players, gameState]);

  function SpawnPlayer(players: PlayersData, key: string) {
    const { turn, color, name } = players[key];
    callUnityFunction("AddPlayer", {
      turn,
      playerId: key,
      playerName: name,
      color,
      isMainPlayer: key === playerId,
    });
  }

  function SpawnItems(players: PlayersData, key: string) {
    const inventory = players[key].inventory;
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
