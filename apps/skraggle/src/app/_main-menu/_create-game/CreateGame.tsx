import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { useState } from "react";
import QRCode from "./QRCode";
import { Button } from "@/components/ui/button";
import PlayerList from "../PlayerList";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import useStartGame from "./useStartGame";
import LeaveGameDialogue from "../LeaveGameDialogue";
import removePlayerHost from "@/server-actions/removePlayerHost";
import { resetLogInCreate } from "@/store/logInCreateSlice";

export default function CreateGame() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();
  const { gameId, playerId } = useSelector(
    (state: RootState) => state.logInCreate,
  );
  const { handleStartGame } = useStartGame(animationCallback);
  const dispatch = useDispatch();

  const handleLeaveGame = async () => {
    try {
      await removePlayerHost({ gameId: gameId, playerKey: playerId });
      animationCallback({
        state: "Sign In to Create",
        slideFrom: "left",
      });
      dispatch(resetLogInCreate());
    } catch (error) {
      animationCallback(
        {
          state: "Sign In to Create",
          slideFrom: "left",
        },
        `${error}`,
      );
    }
  };

  return (
    <InnerPanelWrapper ref={scope}>
      <div className="flex w-full grow gap-8">
        <QRCode />
        <div className="w-full grow">
          <h2 className="my-6 w-full text-center">Players</h2>
          <PlayerList joinCode={gameId} />
        </div>
      </div>
      <div className="flex w-full gap-4">
        <LeaveGameDialogue
          onLeave={() => {
            handleLeaveGame();
          }}
        />
        <Button
          disabled={!enableButtons}
          className="h-12 w-full"
          onClick={() => {
            setEnableButtons(false);
            handleStartGame();
          }}
        >
          Start
        </Button>
      </div>
    </InnerPanelWrapper>
  );
}
