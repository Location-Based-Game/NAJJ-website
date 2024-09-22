import { useDispatch } from "react-redux";
import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { mainMenuState } from "@/state/store";
import { useState } from "react";
import QRCode from "./QRCode";
import PlayerList from "./PlayerList";

export default function CreateGame() {
  const dispatch = useDispatch();
  const [enableButtons, setEnableButtons] = useState(true);

  const [startGameTest, setStartGameTest] = useState(false);

  const { scope, handleAnimation } = usePanelTransition(() => {
    dispatch(mainMenuState.updateState("type name or sign in"));
  });

  return (
    <InnerPanelWrapper ref={scope}>
      <div className="flex w-full grow gap-4">
        <QRCode />
        <PlayerList />
      </div>
      <div className="flex w-full gap-4">
        <button
          disabled={!enableButtons}
          className="h-12 w-full rounded-md border-4 border-gray-700 bg-gray-800 bg-opacity-40"
          onClick={() => {
            setEnableButtons(false);
            handleAnimation();
          }}
        >
          Back
        </button>
        <div className="grow"></div>
        <button
          disabled={!enableButtons}
          className="h-12 w-full rounded-md bg-gray-700"
          onClick={() => {
            setStartGameTest(!startGameTest);
          }}
        >
          Start
        </button>
      </div>
    </InnerPanelWrapper>
  );
}
