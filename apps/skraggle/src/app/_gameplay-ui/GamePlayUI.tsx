import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import NotYourTurnUI from "./_not-your-turn/NotYourTurnUI";
import YourTurnUI from "./_your-turn/YourTurnUI";
import PlayerListGameplay from "./PlayerListGameplay";
import { useCallback } from "react";
import useSpawnItems from "./useSpawnItems";
import useTurnListener from "./useTurnListener";
import useChallengeWordsListener from "./_challenge-words/useChallengeWordsListener";
import WordDefinitions from "./WordDefinitions";

export default function GameplayUI() {
  const { state } = useSelector((state: RootState) => state.gameState);
  const { currentTurn, playerTurn } = useSelector(
    (state: RootState) => state.turnState,
  );

  useSpawnItems();
  useTurnListener();
  useChallengeWordsListener();

  const getGamePlayUI = useCallback(() => {
    if (state !== "Gameplay" && state !== "FirstTurn") return;
    if (currentTurn === playerTurn) {
      return <YourTurnUI />;
    } else {
      return <NotYourTurnUI />;
    }
  }, [state, currentTurn, playerTurn]);

  return (
    <>
      {getGamePlayUI()}
      <PlayerListGameplay />
      <WordDefinitions />
    </>
  );
}
