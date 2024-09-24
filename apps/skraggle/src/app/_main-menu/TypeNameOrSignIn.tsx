import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import usePanelTransition from "@/hooks/usePanelTransition";
import { mainMenuState, RootState } from "@/state/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainMenuState } from "./MainMenuPanel";
import { setGuestName } from "@/state/GuestNameSlice";

export default function TypeNameOrSignIn() {
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
      <button
        disabled={!enableButtons}
        className="h-12 w-full rounded-md border-4 border-gray-700 bg-gray-800 bg-opacity-40"
        onClick={() => {
          handleAnimation("main");
          setEnableButtons(false);
        }}
      >
        Back
      </button>
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
      <button
        disabled={!enableButtons}
        className="h-12 w-full rounded-md bg-gray-700"
        onClick={() => {
          handleAnimation("create game");
          setEnableButtons(false);
        }}
      >
        Continue
      </button>
    </InnerPanelWrapper>
  );
}
