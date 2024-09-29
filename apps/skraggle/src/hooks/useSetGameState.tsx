import { rtdb } from "@/app/firebaseConfig";
import { setGameState } from "@/state/GameStateSlice";
import { mainMenuState, RootState } from "@/state/store";
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
  isLoaded: boolean
) {
  const currentJoinCode = useSelector((state: RootState) => state.joinCode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoaded) return;

    const gameStateRef = ref(
      rtdb,
      `activeGames/${currentJoinCode.code}/gameState`,
    );
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        dispatch(setGameState(data))
        sendMessage("Receiver", "UpdateGameState", data)
      } else {
        dispatch(
          mainMenuState.updateState({
            state: "Home",
            slideFrom: "left",
          }),
        );
      }
    });

    return () => unsubscribe();
  }, [isLoaded]);
}
