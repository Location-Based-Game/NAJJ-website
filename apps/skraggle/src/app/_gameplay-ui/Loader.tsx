import { RootState } from "@/state/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "../UnityPlayer";

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
  }, [isGameActive, splashScreenComplete]);

  return (
    <div className="pointer-events-none absolute z-10 flex h-dvh w-screen items-center justify-center">
      {isGameActive && state === "Menu" ? (
        <div className="flex h-2 w-[10rem] bg-gray-900">
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
