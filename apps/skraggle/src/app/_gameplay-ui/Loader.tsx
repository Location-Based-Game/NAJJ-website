import { RootState } from "@/state/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "../UnityPlayer";

interface Loader {
  children: React.ReactNode;
  splashScreenComplete: boolean;
}

export default function Loader({ children, splashScreenComplete }: Loader) {
  const gameState = useSelector((state: RootState) => state.gameState);
  const { isLoaded, sendMessage, loadingProgression } = useUnityReactContext()

  useEffect(() => {
    if (splashScreenComplete && gameState.isGameActive) {
      sendMessage("Receiver", "StartGame");
    }
  }, [gameState.isGameActive, splashScreenComplete]);

  return (
    <div className="pointer-events-none absolute flex h-dvh w-screen items-center justify-center">
      {gameState.isGameActive && !isLoaded ? (
        <div
          className="h-2 w-[10rem] bg-gray-900"
          style={{ display: isLoaded ? "none" : "flex" }}
        >
          <div
            className="h-full bg-gray-500"
            style={{
              width: `${Math.round(loadingProgression * 100)}%`,
            }}
          ></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}