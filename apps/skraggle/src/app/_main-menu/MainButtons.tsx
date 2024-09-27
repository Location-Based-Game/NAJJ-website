import { useDispatch } from "react-redux";
import { mainMenuState } from "@/state/store";
import { useState } from "react";
import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import { MainMenuState } from "./MainMenuPanel";

export default function MainButtons() {
  const dispatch = useDispatch();
  const [enableButtons, setEnableButtons] = useState(true);

  const { scope, animationCallback } = usePanelTransition(
    (state: MainMenuState) => {
      dispatch(mainMenuState.updateState(state));
    },
  );

  return (
    <InnerPanelWrapper ref={scope}>
      <Button
        disabled={!enableButtons}
        variant={"outline"}
        className="h-12 w-full"
        onClick={() => {
          setEnableButtons(false);
          animationCallback("right", {
            state: "Enter Join Code",
            slideFrom: "right",
          });
        }}
      >
        Join Game
      </Button>
      <Button
        disabled={!enableButtons}
        className="h-12 w-full"
        onClick={() => {
          setEnableButtons(false);
          animationCallback("right", {
            state: "Sign In to Create",
            slideFrom: "right",
          });
        }}
      >
        Create Game
      </Button>
    </InnerPanelWrapper>
  );
}
