"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import MainMenuPanel from "./_main-menu/MainMenuPanel";
import useSetGameState from "./useSetGameState";
import { useUnityReactContext } from "./_unity-player/UnityContext";
import { cn } from "@/lib/tailwindUtils";
import usePlayersData from "@/app/usePlayersData";
import GameplayUIContextProvider from "./_gameplay-ui/GameplayUIContextProvider";
import GameplayUI from "./_gameplay-ui/GameplayUI";
import { forwardRef } from "react";
import loadingBackground from "@styles/loadingBackground.module.css";
import useTransmitWebRTCData from "./_gameplay-ui/useTransmitWebRTCData";
import useSessionRejoin from "./_main-menu/_rejoin/useSessionRejoin";
import UnityCanvas from "./_unity-player/UnityCanvas";

const Viewport = forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const { state: gameState } = useSelector(
      (state: RootState) => state.gameState,
    );
    const { splashScreenComplete } = useUnityReactContext();

    usePlayersData();
    useSetGameState();
    useTransmitWebRTCData();
    useSessionRejoin();

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-[calc(100%-3rem)] items-center justify-center bg-[#eaae6a]",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            loadingBackground.loadingBackground,
            "pointer-events-none transition-opacity",
            !splashScreenComplete ? "opacity-100" : "opacity-0",
          )}
        ></div>
        <div className="pointer-events-none absolute z-10 flex h-full w-full items-center justify-center overflow-hidden">
          <GameplayUIContextProvider>
            {gameState === "Menu" ? <MainMenuPanel /> : <GameplayUI />}
          </GameplayUIContextProvider>
        </div>
        <UnityCanvas />
      </div>
    );
  },
);

Viewport.displayName = "GameUI";
export default Viewport;
