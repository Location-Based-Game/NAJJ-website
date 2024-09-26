import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import usePanelTransition from "@/hooks/usePanelTransition";
import { mainMenuState, RootState } from "@/state/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainMenuState } from "../MainMenuPanel";
import { setGuestName } from "@/state/GuestNameSlice";
import { Button } from "@/components/ui/button";

export default function SignInCreate() {
  const dispatch = useDispatch();
  const guestName = useSelector((state: RootState) => state.guestName);

  const [enableButtons, setEnableButtons] = useState(true);

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
      <div className="flex w-full grow items-center">
        <input
          type="text"
          placeholder="enter name"
          value={guestName.name}
          onChange={(e) => {
            dispatch(setGuestName(e.currentTarget.value))
          }}
          className="h-12 w-full rounded-md bg-gray-950 text-center text-gray-300 outline-none placeholder:text-gray-500"
        />
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
