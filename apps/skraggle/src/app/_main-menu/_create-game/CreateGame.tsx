import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { useState } from "react";
import QRCode from "./QRCode";
import { Button } from "@/components/ui/button";
import PlayerList from "../PlayerList";
import useStartGame from "./useStartGame";
import HostLeaveGame from "./HostLeaveGame";

export default function CreateGame() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();
  const { handleStartGame } = useStartGame();

  return (
    <InnerPanelWrapper ref={scope}>
      <div className="flex w-full grow gap-8">
        <QRCode />
        <div className="w-full grow">
          <h2 className="my-6 w-full text-center">Players</h2>
          <PlayerList />
        </div>
      </div>
      <div className="flex w-full gap-4">
        <HostLeaveGame animationCallback={animationCallback} />
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
