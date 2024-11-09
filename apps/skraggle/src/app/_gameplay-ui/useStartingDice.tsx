import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import type { PlayersData } from "@/components/GetPlayers";
import type { RootState } from "@/store/store";
import { setPlayerTurn } from "@/store/turnSlice";

export default function useStartingDice(players: PlayersData) {
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
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
      AddDice(players, key);
    });

    dispatch(setPlayerTurn(players[playerId].turn))

    isStartingDiceSet.current = true;
  }, [isGameActive, gameId, players]);

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

  function AddDice(players: PlayersData, key: string) {
    const inventory = players[key].inventory;
    Object.keys(inventory).forEach((itemId) => {
      callUnityFunction("CreateStartingDice", {
        playerId: key,
        itemId,
        value: inventory[itemId].data,
      });
    });
  }
}
