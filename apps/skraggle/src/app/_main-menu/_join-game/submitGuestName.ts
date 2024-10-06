import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { FormSchema } from "../GuestNameInput";
import { useDispatch, useSelector } from "react-redux";
import { setGuestKey } from "@/state/GuestNameSlice";
import { RootState } from "@/state/store";
import { MainMenuState } from "@/hooks/usePanelUI";
import { addPlayer } from "@/firebase/addPlayer";
import getRoom from "@/firebase/getRoom";

export type SubmitGuestNameType = typeof submitGuestName;

const submitGuestName = (
  setEnableButtons: React.Dispatch<React.SetStateAction<boolean>>,
  animationCallback: (state: MainMenuState) => void,
) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const currentJoinCode = useSelector((state: RootState) => state.joinCode);

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);

    //check if room exists
    try {
      await getRoom(currentJoinCode.code);
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
      const playerKey = await addPlayer(currentJoinCode.code, values.guestName);
      dispatch(setGuestKey(playerKey));
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

  return { handleSubmit };
};

export default submitGuestName;
