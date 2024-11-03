import { RootState } from "@/store/store";
import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rtdb } from "../firebaseConfig";
import { setCurrentTurn } from "@/store/turnSlice";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { useGetPlayers } from "@/components/GetPlayers";

export default function useTurnListener() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const dispatch = useDispatch();
  const { splashScreenComplete, callUnityFunction } = useUnityReactContext();
  const { playerData } = useGetPlayers();

  useEffect(() => {
    if (!gameId) return;
    if (!splashScreenComplete) return;
    if (!playerData) return;

    const turnRef = ref(rtdb, `activeGames/${gameId}/currentTurn`);
    const unsubscribe = onValue(turnRef, (snapshot) => {
      if (!snapshot.exists()) return;
      if (gameState !== "Gameplay") return;
      const turn = snapshot.val() as number;
      dispatch(setCurrentTurn(turn % Object.keys(playerData).length));
      callUnityFunction("SetTurn", turn % Object.keys(playerData).length);
    });

    return () => {
      unsubscribe();
    };
  }, [gameId, splashScreenComplete, playerData, gameState]);
}
