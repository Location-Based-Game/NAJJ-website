import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import usePanelTransition from "@/hooks/usePanelTransition";
import { RootState } from "@/state/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import useSubmitGuestName from "./useSubmitGuestName";
import GuestNameInput from "./GuestNameInput";
import { Loader2 } from "lucide-react";

export default function SignInJoin() {
  const dispatch = useDispatch();
  const guestName = useSelector((state: RootState) => state.guestName);

  const [enableButtons, setEnableButtons] = useState(true);

  const { scope, animationCallback } = usePanelTransition();

  const { handleSubmit } = useSubmitGuestName(
    setEnableButtons,
    animationCallback,
  );

  return (
    <InnerPanelWrapper ref={scope}>
      <Button
        disabled={!enableButtons}
        variant={"outline"}
        className="h-12 w-full"
        onClick={() => {
          animationCallback({state: "Enter Join Code", slideFrom: "left"});
          setEnableButtons(false);
        }}
      >
        Back
      </Button>
      <GuestNameInput handleSubmit={handleSubmit}>
        <Button
          disabled={!enableButtons || guestName.name.length < 1}
          className="h-12 w-full"
          type="submit"
        >
          {!enableButtons && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </GuestNameInput>
    </InnerPanelWrapper>
  );
}
