import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import type { RootState } from "@/store/store";
import { setPlayerTurn } from "@/store/turnSlice";

//DELETE THIS
export default function useSpawnPlayers() {
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const { callUnityFunction } = useUnityReactContext();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const dispatch = useDispatch();
  const players = useSelector((state: RootState) => state.players);

  useEffect(() => {
    if (!isGameActive) return;
    if (!gameId) return;

    const spawnPlayerData = Object.entries(players).map(([key, data]) => {
      return {
        turn: data.turn,
        playerId: key,
        playerName: data.name,
        color: data.color,
        isMainPlayer: key === playerId,
      };
    });

    if (!spawnPlayerData.some((playerData) => playerData.turn === undefined)) {
      callUnityFunction("SetPlayer", { data: spawnPlayerData });
    }

    dispatch(setPlayerTurn(players[playerId].turn));
  }, [isGameActive, gameId, players]);
}
