import { useToast } from "@/hooks/use-toast";
import usePanelTransition from "@/hooks/usePanelTransition";
import { addPlayer } from "@/server-actions/addPlayer";
import getRoom from "@/server-actions/getRoom";
import { RootState } from "@/store/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GuestNameType } from "../GuestNameInput";
import SignIn from "../SignIn";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";

export default function JoinLogIn() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();

  const { toast } = useToast();
  const currentJoinCode = useSelector((state: RootState) => state.joinCode);

  const handleSubmit = async (values: GuestNameType) => {
    setEnableButtons(false);

    //first check if room exists
    try {
      await getRoom({ gameId: currentJoinCode.code });
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: `${error}`,
      });
      animationCallback({ state: "Enter Join Code", slideFrom: "left" });
      return;
    }

    try {
      const playerKey = await addPlayer({
        gameId: currentJoinCode.code,
        playerName: values.guestName,
      });
      // dispatch(setGuestKey(playerKey));
      animationCallback({ state: "Join Game", slideFrom: "right" });
      return;
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: `${error}`,
      });
      animationCallback({ state: "Home", slideFrom: "left" });
    }

    setEnableButtons(true);
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
