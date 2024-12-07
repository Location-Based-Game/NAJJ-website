import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import NotYourTurnUI from "./_not-your-turn/NotYourTurnUI";
import YourTurnUI from "./_your-turn/YourTurnUI";
import PlayerListGameplay from "./PlayerListGameplay";

export default function GamePlayUI() {
  const gameState = useSelector((state: RootState) => state.gameState);
  const { currentTurn, playerTurn } = useSelector(
    (state: RootState) => state.turnState,
  );

  let gameplayUI = <></>;
  if (gameState.state === "Gameplay") {
    if (currentTurn === playerTurn) {
      gameplayUI = <YourTurnUI />;
    } else {
      gameplayUI = <NotYourTurnUI />;
    }
  }

  return (
    <>
      {gameplayUI}
      <PlayerListGameplay />
    </>
  );
}
