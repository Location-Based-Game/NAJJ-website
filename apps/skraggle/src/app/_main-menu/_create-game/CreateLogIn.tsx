import { logInCreate } from "@/store/logInSlice";
import { AppDispatch, mainMenuState, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignIn from "../SignIn";
import { GuestNameType } from "../GuestNameInput";
import useLogOut from "@/hooks/useLogOut";
import { useMenuButtons } from "../InnerPanelWrapper";
import { SESSION_SET_MESSAGE } from "@shared/constants";

export default function CreateLogIn() {
  const {enableButtons, setEnableButtons} = useMenuButtons()
  const dispatch = useDispatch<AppDispatch>();
  const sessionData = useSelector((state: RootState) => state.logIn);
  const { logOutOnError } = useLogOut();

  useEffect(() => {
    if (sessionData.error && !sessionData.loading) {
      if (sessionData.error.replace("Error: ", "") === SESSION_SET_MESSAGE) {
        location.reload();
      } else {
        logOutOnError(sessionData.error);
      }
    }

    if (!sessionData.error && sessionData.gameId) {
      dispatch(
        mainMenuState.updateState({ state: "Create Game", slideFrom: "right" }),
      );
    }
  }, [sessionData]);

  const handleSubmit = async (values: GuestNameType) => {
    setEnableButtons(false);
    dispatch(logInCreate(values.guestName));
  };

  return (
    <SignIn
      back={{
        state: "Home",
        slideFrom: "left",
      }}
      submitHandler={handleSubmit}
      enableButtons={enableButtons}
    />
  );
}
