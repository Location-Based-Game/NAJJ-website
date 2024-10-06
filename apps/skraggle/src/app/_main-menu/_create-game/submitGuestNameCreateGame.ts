import { useDispatch, useSelector } from "react-redux";
import { SubmitGuestNameType } from "../_join-game/submitGuestName";
import { FormSchema } from "../GuestNameInput";
import { z } from "zod";
import { setGuestKey, setGuestName } from "@/state/GuestNameSlice";
import { setCreateCode } from "@/state/CreateCodeSlice";
import { RootState } from "@/state/store";
import { MainMenuState } from "@/hooks/usePanelUI";
import CreateRoom from "@/firebase/CreateRoom";
import { AddPlayer, AddTestPlayer } from "@/firebase/AddPlayer";

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
  animationCallback: (state: MainMenuState) => void,
) => {
  const dispatch = useDispatch();
  const currentCreateCode = useSelector((state: RootState) => state.createCode);

  let id:string = "";
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);
    dispatch(setGuestName(values.guestName));

    if (!currentCreateCode.code) {
      const code = makeid(4);
      dispatch(setCreateCode(code));

      await CreateRoom(code);
      id = await AddPlayer(code, values.guestName);
    } else if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
    ) {
      await CreateRoom(currentCreateCode.code);
      id = await AddTestPlayer(currentCreateCode.code, values.guestName);
    } else {
      id = await AddPlayer(currentCreateCode.code, values.guestName);
    }

    animationCallback({ state: "Create Game", slideFrom: "right" });
  };

  dispatch(setGuestKey(id))
  return { handleSubmit };
};

export default submitGuestNameCreateGame;
