import { useDispatch } from "react-redux";
import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { mainMenuState } from "@/state/store";
import { useState } from "react";

export default function CreateGame() {
  const dispatch = useDispatch();
  const [enableButtons, setEnableButtons] = useState(true);

  const { scope, handleAnimation } = usePanelTransition(() => {
    dispatch(mainMenuState.updateState({ state: "main" }));
  });

  return (
    <InnerPanelWrapper ref={scope}>
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
      >
        Start
      </button>
    </InnerPanelWrapper>
  );
}
