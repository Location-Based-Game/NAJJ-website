"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import MainMenuPanel from "./_main-menu/MainMenuPanel";
import useSetGameState from "./_gameplay-ui/useSetGameState";
import { useUnityReactContext } from "./_unity-player/UnityContext";
import dynamic from "next/dynamic";
import { cn } from "@/lib/tailwindUtils";
import usePlayersData from "@/app/_gameplay-ui/usePlayersData";
import GameplayUIContextProvider from "./_gameplay-ui/GameplayUIContextProvider";
import GameplayUI from "./_gameplay-ui/GameplayUI";

const Unity = dynamic(
  () => import("react-unity-webgl").then((mod) => mod.Unity),
  { ssr: false },
);

export default function GameUI() {
  const { state: gameState, isGameActive } = useSelector(
    (state: RootState) => state.gameState,
  );
  const { splashScreenComplete, unityProvider } = useUnityReactContext();

  usePlayersData();
  useSetGameState();

  return (
    <div className="relative flex h-[calc(100dvh-3rem)] items-center justify-center bg-secondary">
      <div className="pointer-events-none absolute z-10 flex h-full w-full items-center justify-center overflow-hidden">
        <GameplayUIContextProvider>
          {gameState === "Menu" ? <MainMenuPanel /> : <GameplayUI />}
        </GameplayUIContextProvider>
      </div>
      <Unity
        unityProvider={unityProvider}
        className={cn(
          "h-full w-full transition-opacity duration-700",
          isGameActive ? "pointer-events-auto" : "pointer-events-none",
          splashScreenComplete ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
