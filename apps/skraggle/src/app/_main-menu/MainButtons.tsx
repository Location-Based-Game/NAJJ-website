import { useDispatch } from "react-redux";
import { mainMenuState } from "@/state/store";
import { useState } from "react";
import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";

export default function MainButtons() {
  const dispatch = useDispatch();
  const [enableButtons, setEnableButtons] = useState(true);

  const {scope, handleAnimation} = usePanelTransition(() => {
    dispatch(
      mainMenuState.updateState("type name or sign in"),
    );
  })

  return (
    <InnerPanelWrapper ref={scope}>
      <button
        disabled={!enableButtons}
        className="h-12 w-full rounded-md border-4 border-gray-700 bg-gray-800 bg-opacity-40"
      >
        Join Game
      </button>
      <button
        disabled={!enableButtons}
        className="h-12 w-full rounded-md bg-gray-700"
        onClick={() => {
          setEnableButtons(false);
          handleAnimation();
        }}
      >
        Create Game
      </button>
    </InnerPanelWrapper>
  );
}
