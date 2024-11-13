import { RootState } from "@/store/store";
import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rtdb } from "../firebaseConfig";
import { setCurrentTurn } from "@/store/turnSlice";
import { useUnityReactContext } from "../_unity-player/UnityContext";

export default function useTurnListener() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const dispatch = useDispatch();
  const { splashScreenComplete, callUnityFunction } = useUnityReactContext();
  const players = useSelector((state:RootState) => state.players)

  useEffect(() => {
    if (!gameId) return;
    if (!splashScreenComplete) return;

    const turnRef = ref(rtdb, `activeGames/${gameId}/currentTurn`);
    const unsubscribe = onValue(turnRef, (snapshot) => {
      if (!snapshot.exists()) return;
      if (gameState !== "Gameplay") return;
      const turn = snapshot.val() as number;
      dispatch(setCurrentTurn(turn % Object.keys(players).length));
      callUnityFunction("SetTurn", turn % Object.keys(players).length);
    });

    return () => {
      unsubscribe();
    };
  }, [gameId, splashScreenComplete, players, gameState]);
}
