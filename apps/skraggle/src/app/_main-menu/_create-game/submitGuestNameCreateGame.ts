import { useDispatch, useSelector } from "react-redux";
import { SubmitGuestNameType } from "../_join-game/submitGuestName";
import { FormSchema } from "../GuestNameInput";
import { MainMenuState } from "../MainMenuPanel";
import { z } from "zod";
import { setGuestName } from "@/state/GuestNameSlice";
import { rtdb } from "@/app/firebaseConfig";
import { setCreateCode } from "@/state/CreateCodeSlice";
import { RootState } from "@/state/store";
import { push, ref, set } from "firebase/database";

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
  const currentJoinCode = useSelector((state: RootState) => state.createCode);

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);
    dispatch(setGuestName(values.guestName));

    if (!currentJoinCode.code) {
      const code = makeid(4);
      dispatch(setCreateCode(code));

      await set(ref(rtdb, `activeGames/${code}`), {
        name: code,
        players: [],
      });

      await AddPlayerToDatabase(code, values.guestName)
    }
    else {
      await AddPlayerToDatabase(currentJoinCode.code, values.guestName)
    }
    
    animationCallback({ state: "Create Game", slideFrom: "right" });
  };

  return { handleSubmit };
};

async function AddPlayerToDatabase(code:string, name:string) {
  const playersRef = ref(rtdb, `activeGames/${code}/players`);
  const newPlayerRef = await push(playersRef);
  if (!newPlayerRef.key) {
    //throw error
    return;
  }

  await set(newPlayerRef, name);
}

export default submitGuestNameCreateGame;
