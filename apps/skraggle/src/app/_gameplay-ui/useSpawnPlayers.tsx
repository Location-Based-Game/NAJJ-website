import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { useGetPlayers } from "@/components/PlayersDataProvider";
import type { RootState } from "@/store/store";
import { setPlayerTurn } from "@/store/turnSlice";

export default function useSpawnPlayers() {
  const { isGameActive, state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const { callUnityFunction } = useUnityReactContext();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const dispatch = useDispatch();
  const { playerData } = useGetPlayers();

  useEffect(() => {
    if (!isGameActive) return;
    if (!gameId) return;

    const spawnPlayerData = Object.entries(playerData).map(([key, data]) => {
      return {
        turn: data.turn,
        playerId: key,
        playerName: data.name,
        color: data.color,
        isMainPlayer: key === playerId,
      };
    });

    if (!spawnPlayerData.some(playerData => playerData.turn === undefined)) {
      callUnityFunction("SetPlayer", { data: spawnPlayerData });
    }

    dispatch(setPlayerTurn(playerData[playerId].turn));
  }, [isGameActive, gameId, playerData, gameState]);
}
