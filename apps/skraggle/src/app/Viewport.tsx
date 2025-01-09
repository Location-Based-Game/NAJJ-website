"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import MainMenuPanel from "./_main-menu/MainMenuPanel";
import useSetGameState from "./useSetGameState";
import { useUnityReactContext } from "./_unity-player/UnityContext";
import dynamic from "next/dynamic";
import { cn } from "@/lib/tailwindUtils";
import usePlayersData from "@/app/usePlayersData";
import GameplayUIContextProvider from "./_gameplay-ui/GameplayUIContextProvider";
import GameplayUI from "./_gameplay-ui/GameplayUI";
import { forwardRef, useEffect, useState } from "react";
import cursors from "@styles/cursors.module.css"
import useTransmitWebRTCData from "./_gameplay-ui/useTransmitWebRTCData";

const Unity = dynamic(
  () => import("react-unity-webgl").then((mod) => mod.Unity),
  { ssr: false },
);

const Viewport = forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
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
    useSetGameState();
    useTransmitWebRTCData();

    const [viewPortCursor, setViewPortCursor] = useState(cursors.auto)
    const updateCursor = (cursorType: any) => {
      setViewPortCursor(cursors[cursorType]);
    };

    useEffect(() => {
      if (!splashScreenComplete) return;
      addEventListener("SetCursorType", updateCursor);

      return () => {
        removeEventListener("SetCursorType", updateCursor);
      };
    }, [addEventListener, removeEventListener, splashScreenComplete]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-[calc(100dvh-3rem)] items-center justify-center bg-secondary",
          className,
        )}
        {...props}
      >
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
            viewPortCursor
          )}
        />
      </div>
    );
  },
);

Viewport.displayName = "GameUI";
export default Viewport;
