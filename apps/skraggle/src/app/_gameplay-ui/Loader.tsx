import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";

interface Loader {
  children: React.ReactNode;
  splashScreenComplete: boolean;
}

export default function Loader({ children, splashScreenComplete }: Loader) {
  const { isGameActive, state } = useSelector(
    (state: RootState) => state.gameState,
  );

  const { sendMessage, loadingProgression } = useUnityReactContext();

  useEffect(() => {
    if (isGameActive && splashScreenComplete) {
      // sendMessage("Receiver", "StartGame");
    }
  }, [isGameActive, splashScreenComplete, state]);

  return (
    <div className="pointer-events-none absolute z-10 flex h-dvh w-screen items-center justify-center">
      {isGameActive && state === "Menu" ? (
        <div className="relative flex h-2 w-[10rem] bg-background drop-shadow-lg">
          <div className="absolute top-4 w-full text-center">Loading</div>
          <div
            className="h-full bg-primary"
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
