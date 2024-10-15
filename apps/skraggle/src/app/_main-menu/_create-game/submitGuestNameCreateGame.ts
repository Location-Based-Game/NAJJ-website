import { useDispatch, useSelector } from "react-redux";
import { SubmitGuestNameType } from "../_join-game/submitGuestName";
import { FormSchema } from "../GuestNameInput";
import { z } from "zod";
import { logInCreate, resetLogInCreate } from "@/store/logInCreateSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { AnimationCallback } from "@/hooks/usePanelTransition";

const submitGuestNameCreateGame: SubmitGuestNameType = (
  setEnableButtons: React.Dispatch<React.SetStateAction<boolean>>,
  animationCallback: AnimationCallback,
) => {
  const dispatch = useDispatch<AppDispatch>();

  const sessionData = useSelector((state: RootState) => state.logInCreate);

  useEffect(() => {
    if (sessionData.error && !sessionData.loading) {
      dispatch(resetLogInCreate());

      animationCallback(
        { state: "Home", slideFrom: "left" },
        sessionData.error,
      );
    }

    if (!sessionData.error && sessionData.gameId) {
      // dispatch(setGuestName(sessionData.playerName));
      // dispatch(setCreateCode(sessionData.gameId));
      // dispatch(setGuestKey(sessionData.playerId));

      animationCallback(
        { state: "Create Game", slideFrom: "right" },
      );
    }
  }, [sessionData]);

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);
    dispatch(logInCreate(values.guestName));
  };

  return { handleSubmit };
};

export default submitGuestNameCreateGame;
