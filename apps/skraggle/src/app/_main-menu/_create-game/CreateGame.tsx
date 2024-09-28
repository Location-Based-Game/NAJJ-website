import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { useState } from "react";
import QRCode from "./QRCode";
import { Button } from "@/components/ui/button";
import PlayerList from "../PlayerList";

export default function CreateGame() {
  const [enableButtons, setEnableButtons] = useState(true);

  const [startGameTest, setStartGameTest] = useState(false);

  const { scope, animationCallback } = usePanelTransition();

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
        <Button
          disabled={!enableButtons}
          className="h-12 w-full"
          variant={"outline"}
          onClick={() => {
            setEnableButtons(false);
            animationCallback({
              state: "Sign In to Create",
              slideFrom: "left",
            });
          }}
        >
          Back
        </Button>
        <Button
          disabled={!enableButtons}
          className="h-12 w-full"
          onClick={() => {
            setStartGameTest(!startGameTest);
          }}
        >
          Start
        </Button>
      </div>
    </InnerPanelWrapper>
  );
}
