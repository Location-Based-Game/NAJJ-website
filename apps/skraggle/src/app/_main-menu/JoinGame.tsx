import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import usePanelTransition from "@/hooks/usePanelTransition";
import { useState } from "react";
import { MainMenuState } from "./MainMenuPanel";
import { useDispatch } from "react-redux";
import { mainMenuState } from "@/state/store";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function JoinGame() {
  const [enableButtons, setEnableButtons] = useState(true);
  const dispatch = useDispatch();
  const { scope, handleAnimation } = usePanelTransition(
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
          handleAnimation("main");
          setEnableButtons(false);
        }}
      >
        Back
      </Button>
      <div className="flex flex-col gap-4 w-full grow items-center justify-center">
        <h2>Enter Join Code</h2>
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button
        disabled={!enableButtons}
        className="h-12 w-full"
        onClick={() => {
          handleAnimation("create game");
          setEnableButtons(false);
        }}
      >
        Continue
      </Button>
    </InnerPanelWrapper>
  );
}
