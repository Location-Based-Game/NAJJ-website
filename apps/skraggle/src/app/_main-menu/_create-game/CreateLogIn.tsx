import { logInCreate } from "@/store/logInSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignIn from "../SignIn";
import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { GuestNameType } from "../GuestNameInput";
import useLogOut from "@/hooks/useLogOut";

export default function CreateLogIn() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();
  const dispatch = useDispatch<AppDispatch>();
  const sessionData = useSelector((state: RootState) => state.logIn);
  const { logOutOnError } = useLogOut();

  useEffect(() => {
    if (sessionData.error && !sessionData.loading) {
      logOutOnError(sessionData.error);
    }

    if (!sessionData.error && sessionData.gameId) {
      animationCallback({ state: "Create Game", slideFrom: "right" });
    }
  }, [sessionData]);

  const handleSubmit = async (values: GuestNameType) => {
    setEnableButtons(false);
    dispatch(logInCreate(values.guestName));
  };

  return (
    <InnerPanelWrapper ref={scope}>
      <SignIn
        back={{
          state: "Home",
          slideFrom: "left",
        }}
        submitHandler={handleSubmit}
        animationCallback={animationCallback}
        enableButtons={enableButtons}
      />
    </InnerPanelWrapper>
  );
}
