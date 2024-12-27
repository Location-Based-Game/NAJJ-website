import { RootState } from "@/store/store";
import { onValue, ref } from "firebase/database";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rtdb } from "../firebaseConfig";
import { enableWebRTCAfterFirstTurn, setCurrentTurn } from "@/store/turnSlice";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { GameStates } from "@types";

export default function useTurnListener() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const dispatch = useDispatch();
  const { splashScreenComplete, callUnityFunction } = useUnityReactContext();
  const players = useSelector((state:RootState) => state.players)
  const firstTurn = useRef<number>()
  const firstState = useRef(false)

  useEffect(() => {
    if (!gameId) {
      firstTurn.current = undefined;
      firstState.current = false;
      return;
    };
    if (!splashScreenComplete) return;

    const turnRef = ref(rtdb, `activeGames/${gameId}/currentTurn`);
    const unsubscribe = onValue(turnRef, (snapshot) => {
      if (!snapshot.exists()) return;

      if (gameState !== "Menu") {
        getFirstJoinState(gameState)
      }

      if (gameState === "Gameplay" || gameState === "FirstTurn") {
        const turn = snapshot.val() as number;

        dispatch(setCurrentTurn(turn));
        callUnityFunction("SetTurn", turn);

        if (firstTurn.current === undefined) {
          firstTurn.current = turn;
        }

        if (firstTurn.current !== turn) {
          dispatch(enableWebRTCAfterFirstTurn(true))
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [gameId, splashScreenComplete, players, gameState]);
  
  /**
   * in order to fix board persist bugs, disable WebRTC data transfer
   * for the first turn if the player joins during GamePlay state
   */
  function getFirstJoinState(state: GameStates) {
    if (firstState.current) return;
    firstState.current = true;

    if (state === "Gameplay" || state === "FirstTurn") {
      dispatch(enableWebRTCAfterFirstTurn(false))
    }
  }
}
