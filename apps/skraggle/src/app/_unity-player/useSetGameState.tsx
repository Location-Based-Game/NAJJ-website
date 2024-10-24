import { rtdb } from "@/app/firebaseConfig";
import { useToast } from "@/hooks/use-toast";
import { GameStates } from "@/schemas/gameStateSchema";
import { setGameActive, setGameState } from "@/store/gameStateSlice";
import { mainMenuState, RootState } from "@/store/store";
import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";

export default function useSetGameState(
  sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: ReactUnityEventParameter,
  ) => void,
  splashScreenComplete: boolean,
) {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (!splashScreenComplete || !gameId) return;

    const gameStateRef = ref(rtdb, `activeGames/${gameId}/gameState`);
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      if (snapshot.exists()) {
        const state = snapshot.val() as GameStates;
        dispatch(setGameState(state));
        sendMessage("Receiver", "UpdateGameState", state);

        if (state !== "Menu") {
          dispatch(setGameActive(true));
        }
      } else {
        console.error("Game no longer exists!");
      }
    });

    return () => unsubscribe();
  }, [splashScreenComplete, gameId]);
}
