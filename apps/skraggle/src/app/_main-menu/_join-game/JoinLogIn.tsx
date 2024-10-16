import usePanelTransition from "@/hooks/usePanelTransition";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GuestNameType } from "../GuestNameInput";
import SignIn from "../SignIn";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { logInJoin, resetLogInCreate } from "@/store/logInSlice";

export default function JoinLogIn() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();
  const currentJoinCode = useSelector((state: RootState) => state.joinCode);
  const sessionData = useSelector((state: RootState) => state.logIn);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (sessionData.error && !sessionData.loading) {
      dispatch(resetLogInCreate());

      animationCallback(
        { state: "Home", slideFrom: "left" },
        sessionData.error,
      );
    }

    if (!sessionData.error && sessionData.gameId) {
      animationCallback({ state: "Join Game", slideFrom: "right" });
    }
  }, [sessionData]);

  const handleSubmit = async (values: GuestNameType) => {
    setEnableButtons(false);
    dispatch(
      logInJoin({
        playerName: values.guestName,
        joinCode: currentJoinCode.code,
      }),
    );
  };

  return (
    <InnerPanelWrapper ref={scope}>
      <SignIn
        back={{
          state: "Enter Join Code",
          slideFrom: "left",
        }}
        submitHandler={handleSubmit}
        animationCallback={animationCallback}
        enableButtons={enableButtons}
      />
    </InnerPanelWrapper>
  );
}
