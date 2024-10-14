import { useDispatch } from "react-redux";
import { SubmitGuestNameType } from "../_join-game/submitGuestName";
import { FormSchema } from "../GuestNameInput";
import { z } from "zod";
import { setGuestKey, setGuestName } from "@/store/GuestNameSlice";
import { setCreateCode } from "@/store/CreateCodeSlice";
import { MainMenuState } from "@/hooks/usePanelUI";
import createRoom from "@/server-actions/createRoom";
import { addPlayer } from "@/server-actions/addPlayer";
import setHost from "@/server-actions/setHost";
import { logIn } from "@/server-actions/logIn";

const submitGuestNameCreateGame: SubmitGuestNameType = (
  setEnableButtons: React.Dispatch<React.SetStateAction<boolean>>,
  animationCallback: (state: MainMenuState, error?: string) => void,
) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);
    dispatch(setGuestName(values.guestName));

    let playerKey: string = "";
    try {
      const code = await logIn({});
      console.log(code)
      dispatch(setCreateCode(code));
      await createRoom({gameId: code});
      playerKey = await addPlayer({
        gameId: code,
        playerName: values.guestName,
      });

      await setHost({gameId: code, playerKey})

      dispatch(setGuestKey(playerKey));
      animationCallback({ state: "Create Game", slideFrom: "right" });
    } catch (error) {
      animationCallback({ state: "Home", slideFrom: "left" }, `${error}`);
    }
  };

  return { handleSubmit };
};

export default submitGuestNameCreateGame;
