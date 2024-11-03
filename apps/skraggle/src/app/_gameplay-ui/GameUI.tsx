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

export default function GameUI() {
  const gameState = useSelector((state: RootState) => state.gameState);
  const { currentTurn, playerTurn } = useSelector(
    (state: RootState) => state.turnState,
  );
  const { playerData } = useGetPlayers();
  const {callUnityFunction, splashScreenComplete} = useUnityReactContext()
  
  useStartingDice(playerData);
  useSendBoardItemData();
  useGetLetterBlocks();
  useTurnListener();
  useSetGameState(callUnityFunction, splashScreenComplete);

  switch (gameState.state) {
    case "Menu":
      return <MainMenuPanel />;
    case "TurnsDiceRoll":
      return <></>;
    case "Gameplay":
      return currentTurn === playerTurn ? <YourTurnUI /> : <NotYourTurnUI />;
  }
}
