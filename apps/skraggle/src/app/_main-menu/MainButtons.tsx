import { useDispatch } from "react-redux";
import { useState } from "react";
import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";

export default function MainButtons() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();

  return (
    <InnerPanelWrapper ref={scope}>
      <Button
        disabled={!enableButtons}
        variant={"outline"}
        className="h-12 w-full"
        onClick={() => {
          setEnableButtons(false);
          animationCallback({
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
          animationCallback({
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
