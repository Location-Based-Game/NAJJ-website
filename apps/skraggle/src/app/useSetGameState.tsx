import { rtdb } from "@/app/firebaseConfig";
import { setGameActive, setGameState } from "@/store/gameStateSlice";
import { RootState } from "@/store/store";
import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUnityReactContext } from "./_unity-player/UnityContext";
import useLogOut from "@/hooks/useLogOut";
import { GameStates } from "@types";

export default function useSetGameState() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const dispatch = useDispatch();
  const { logOutOnError } = useLogOut();
  const { callUnityFunction, splashScreenComplete } = useUnityReactContext();

  useEffect(() => {
    if (!splashScreenComplete || !gameId) return;

    const gameStateRef = ref(rtdb, `activeGames/${gameId}/gameState`);
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      if (!snapshot.exists()) {
        logOutOnError("Game no longer exists!");
        return;
      }

      const state = snapshot.val() as GameStates;

      dispatch(setGameState(state));
      callUnityFunction("UpdateGameState", state);

      if (state !== "Menu") {
        dispatch(setGameActive(true));
      }
    });

    return () => unsubscribe();
  }, [splashScreenComplete, gameId]);
}
