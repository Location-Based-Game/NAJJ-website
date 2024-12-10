"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import MainMenuPanel from "../_main-menu/_home/MainMenuPanel";
import useSendBoardItemData from "./useSendBoardItemData";
import useTurnListener from "./useTurnListener";
import useSetGameState from "./useSetGameState";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import dynamic from "next/dynamic";
import { cn } from "@/lib/tailwindUtils";
import usePlayersData from "@/app/_gameplay-ui/usePlayersData";
import useSpawnItems from "./useSpawnItems";
import useSetInventories from "./useSetInventories";
import GamePlayUI from "./GamePlayUI";
import { createContext, useCallback, useEffect, useState } from "react";

const Unity = dynamic(
  () => import("react-unity-webgl").then((mod) => mod.Unity),
  { ssr: false },
);

export const GamePlayUIContext = createContext<boolean>(false);

export default function GameUI() {
  const { state: gameState, isGameActive } = useSelector(
    (state: RootState) => state.gameState,
  );
  const {
    splashScreenComplete,
    unityProvider,
    addEventListener,
    removeEventListener,
  } = useUnityReactContext();

  usePlayersData();
  useSetInventories();
  useSpawnItems();
  useSendBoardItemData();
  useTurnListener();
  useSetGameState();

  const [showUI, setShowUI] = useState(false);
  const handleShowGamePlayUI = useCallback(() => {
    setShowUI(true);
  }, []);

  useEffect(() => {
    if (!isGameActive) {
      setShowUI(false);
    }
    addEventListener("ShowGamePlayUI", handleShowGamePlayUI);

    return () => {
      removeEventListener("ShowGamePlayUI", handleShowGamePlayUI);
    };
  }, [addEventListener, removeEventListener, handleShowGamePlayUI, isGameActive]);

  return (
    <div className="relative flex h-[calc(100dvh-3rem)] items-center justify-center bg-secondary">
      <div className="pointer-events-none absolute z-10 flex h-full w-full items-center justify-center">
        <GamePlayUIContext.Provider value={showUI}>
          {gameState === "Menu" ? <MainMenuPanel /> : <GamePlayUI />}
        </GamePlayUIContext.Provider>
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
