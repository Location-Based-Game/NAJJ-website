"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import MainMenuPanel from "../_main-menu/_home/MainMenuPanel";
import YourTurnUI from "./_your-turn/YourTurnUI";
import useSendBoardItemData from "./useSendBoardItemData";
import useGetLetterBlocks from "./useGetLetterBlocks";
import NotYourTurnUI from "./_not-your-turn/NotYourTurnUI";
import useTurnListener from "./useTurnListener";
import useSetGameState from "./useSetGameState";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import PlayerListGameplay from "./PlayerListGameplay";
import dynamic from "next/dynamic";
import { cn } from "@/lib/tailwindUtils";
import usePlayersData from "@/hooks/usePlayersData";
import useInventories from "./useInventories";

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
  useInventories();
  useSendBoardItemData();
  useGetLetterBlocks();
  useTurnListener();
  useSetGameState();

  return (
    <div className="relative flex h-[calc(100dvh-3rem)] items-center justify-center bg-secondary">
      <div className="pointer-events-none absolute z-10 flex h-full w-full items-center justify-center">
        {gameState === "Menu" ? <MainMenuPanel /> : <GamePlayUI />}
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

function GamePlayUI() {
  const gameState = useSelector((state: RootState) => state.gameState);
  const { currentTurn, playerTurn } = useSelector(
    (state: RootState) => state.turnState,
  );

  let gameplayUI = <></>;
  if (gameState.state === "Gameplay") {
    gameplayUI =
      currentTurn === playerTurn ? <YourTurnUI /> : <NotYourTurnUI />;
  }

  return (
    <>
      {gameplayUI}
      <PlayerListGameplay />
    </>
  );
}
