import { useDispatch, useSelector } from "react-redux";
import { SubmitGuestNameType } from "../_join-game/submitGuestName";
import { FormSchema } from "../GuestNameInput";
import { z } from "zod";
import { setGuestKey, setGuestName } from "@/store/GuestNameSlice";
import { setCreateCode } from "@/store/CreateCodeSlice";
import { RootState } from "@/store/store";
import { MainMenuState } from "@/hooks/usePanelUI";
import createRoom from "@/server-actions/createRoom";
import { addPlayer, addTestPlayer } from "@/server-actions/addPlayer";
import setHost from "@/server-actions/setHost";

function makeid(length: number): string {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
  ) {
    return process.env.NEXT_PUBLIC_PLACEHOLDER_CODE;
  }

  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const submitGuestNameCreateGame: SubmitGuestNameType = (
  setEnableButtons: React.Dispatch<React.SetStateAction<boolean>>,
  animationCallback: (state: MainMenuState, error?: string) => void,
) => {
  const dispatch = useDispatch();
  const currentCreateCode = useSelector((state: RootState) => state.createCode);

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);
    dispatch(setGuestName(values.guestName));

    let playerKey: string = "";
    try {
      //Create Test Room
      if (
        process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
      ) {
        await createRoom({ gameId: currentCreateCode.code as string });
        playerKey = await addTestPlayer(currentCreateCode.code, values.guestName);
        animationCallback({ state: "Create Game", slideFrom: "right" });
        return;
      }

      const code = makeid(4);
      dispatch(setCreateCode(code));
      await createRoom({ gameId: code });
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
