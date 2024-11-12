import { rtdb } from "@/app/firebaseConfig";
import { GameStates } from "@/schemas/gameStateSchema";
import { setGameActive, setGameState } from "@/store/gameStateSlice";
import { RootState } from "@/store/store";
import { ref, onValue } from "firebase/database";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CallUnityFunctionType } from "../_unity-player/UnityContext";
import useLogOut from "@/hooks/useLogOut";

export default function useSetGameState(
  callUnityFunction: CallUnityFunctionType,
  splashScreenComplete: boolean,
) {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const dispatch = useDispatch();
  const { logOutOnError } = useLogOut();
  const turnsDiceRollStateSet = useRef(false)

  useEffect(() => {
    if (!splashScreenComplete || !gameId) return;

    const gameStateRef = ref(rtdb, `activeGames/${gameId}/gameState`);
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      if (!snapshot.exists()) {
        logOutOnError("Game no longer exists!");
        return;
      }

      const state = snapshot.val() as GameStates;

      if (state === "TurnsDiceRoll") {
        dispatch(setGameState(state));
        callUnityFunction("UpdateGameState", state);
        turnsDiceRollStateSet.current = true;
      } else if (state === "Gameplay" && !turnsDiceRollStateSet.current) {
        dispatch(setGameState(state));
        callUnityFunction("UpdateGameState", state);
      }

      if (state !== "Menu") {
        dispatch(setGameActive(true));
      }

    });

    return () => unsubscribe();
  }, [splashScreenComplete, gameId]);
}
