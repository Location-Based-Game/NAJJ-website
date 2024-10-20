import { rtdb } from "@/app/firebaseConfig";
import { useToast } from "@/hooks/use-toast";
import { GameStates } from "@/schemas/gameStateSchema";
import { setGameState } from "@/store/gameStateSlice";
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
  isLoaded: boolean,
) {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoaded || !isGameActive) return;

    const gameStateRef = ref(rtdb, `activeGames/${gameId}/gameState`);
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      if (snapshot.exists()) {
        const state = snapshot.val() as GameStates;
        console.log(state)
        dispatch(setGameState(state));
        sendMessage("Receiver", "UpdateGameState", state);
      } else {
        console.error("Game no longer exists!");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Game no longer exists!",
        });

        dispatch(
          mainMenuState.updateState({
            state: "Home",
            slideFrom: "left",
          }),
        );
      }
    });

    return () => unsubscribe();
  }, [isLoaded, isGameActive]);
}
