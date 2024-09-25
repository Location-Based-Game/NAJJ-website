import { useDispatch } from "react-redux";
import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { mainMenuState } from "@/state/store";
import { useState } from "react";
import QRCode from "./QRCode";
import PlayerList from "./PlayerList";
import { Button } from "@/components/ui/button";

export default function CreateGame() {
  const dispatch = useDispatch();
  const [enableButtons, setEnableButtons] = useState(true);

  const [startGameTest, setStartGameTest] = useState(false);

  const { scope, handleAnimation } = usePanelTransition(() => {
    dispatch(mainMenuState.updateState("type name or sign in"));
  });

  return (
    <InnerPanelWrapper ref={scope}>
      <div className="flex w-full grow gap-8">
        <QRCode />
        <PlayerList />
      </div>
      <div className="flex w-full gap-4">
        <Button
          disabled={!enableButtons}
          className="h-12 w-full"
          variant={"outline"}   
          onClick={() => {
            setEnableButtons(false);
            handleAnimation();
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
