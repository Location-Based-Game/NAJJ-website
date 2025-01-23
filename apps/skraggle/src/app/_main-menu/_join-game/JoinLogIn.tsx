import { AppDispatch, mainMenuState, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GuestNameType } from "../GuestNameInput";
import SignIn from "../SignIn";
import { logInJoin } from "@/store/logInSlice";
import useLogOut from "@/hooks/useLogOut";
import { useMenuButtons } from "../InnerPanelWrapper";
import { SESSION_SET_MESSAGE } from "@shared/constants";

export default function JoinLogIn() {
  const { enableButtons, setEnableButtons } = useMenuButtons();
  const currentJoinCode = useSelector((state: RootState) => state.joinCode);
  const sessionData = useSelector((state: RootState) => state.logIn);
  const { logOutOnError } = useLogOut();
  const dispatch = useDispatch<AppDispatch>();

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
        mainMenuState.updateState({ state: "Join Game", slideFrom: "right" }),
      );
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
    <>
      <SignIn
        back={{
          state: "Enter Join Code",
          slideFrom: "left",
        }}
        submitHandler={handleSubmit}
        enableButtons={enableButtons}
      />
    </>
  );
}
