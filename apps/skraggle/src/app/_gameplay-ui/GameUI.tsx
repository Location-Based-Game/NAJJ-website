"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import MainMenuPanel from "../_main-menu/_home/MainMenuPanel";
import YourTurnUI from "./_your-turn/YourTurnUI";
import { useGetPlayers } from "@/components/GetPlayers";
import useSendBoardItemData from "./useSendBoardItemData";
import useStartingDice from "./useStartingDice";
import useGetLetterBlocks from "./useGetLetterBlocks";
import NotYourTurnUI from "./_not-your-turn/NotYourTurnUI";
import useTurnListener from "./useTurnListener";
import useSetGameState from "./useSetGameState";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import PlayerListGameplay from "./PlayerListGameplay";
import dynamic from "next/dynamic";

const Unity = dynamic(
  () => import("react-unity-webgl").then((mod) => mod.Unity),
  { ssr: false },
);

export default function GameUI() {
  const gameState = useSelector((state: RootState) => state.gameState);
  const { playerData } = useGetPlayers();
  const { callUnityFunction, splashScreenComplete, unityProvider } =
    useUnityReactContext();

  useStartingDice(playerData);
  useSendBoardItemData();
  useGetLetterBlocks();
  useTurnListener();
  useSetGameState(callUnityFunction, splashScreenComplete);

  return (
    <div className="relative flex h-[calc(100dvh-3rem)] items-center justify-center bg-secondary">
      <div className="w-full h-full pointer-events-none absolute z-10 flex items-center justify-center">
        {gameState.state === "Menu" ? <MainMenuPanel /> : <GamePlayUI />}
      </div>
      <Unity
        unityProvider={unityProvider}
        className={`h-full w-full pointer-events-auto transition-opacity duration-700 ${splashScreenComplete ? "opacity-100" : "opacity-0"}`}
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
