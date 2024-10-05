import { useDispatch, useSelector } from "react-redux";
import { SubmitGuestNameType } from "../_join-game/submitGuestName";
import { FormSchema } from "../GuestNameInput";
import { z } from "zod";
import { setGuestName } from "@/state/GuestNameSlice";
import { rtdb } from "@/app/firebaseConfig";
import { setCreateCode } from "@/state/CreateCodeSlice";
import { RootState } from "@/state/store";
import { push, ref, set } from "firebase/database";
import { MainMenuState } from "@/hooks/usePanelUI";

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

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);
    dispatch(setGuestName(values.guestName));

    if (!currentCreateCode.code) {
      const code = makeid(4);
      dispatch(setCreateCode(code));

      await CreateEmptyRoom(code);
      await AddPlayerToDatabase(code, values.guestName);
    } else if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
    ) {
      await CreateEmptyRoom(currentCreateCode.code);
      await AddPlayerToDatabase(currentCreateCode.code, values.guestName);

      // await AddTestPlayer(currentCreateCode.code, values.guestName);
    } else {
      await AddPlayerToDatabase(currentCreateCode.code, values.guestName);
    }

    animationCallback({ state: "Create Game", slideFrom: "right" });
  };

  return { handleSubmit };
};

async function CreateEmptyRoom(code: string) {
  await set(ref(rtdb, `activeGames/${code}`), {
    name: code,
    gameState: "Menu",
    players: [],
    turnOrder: [],
    initialDiceData: null,
    currentTurn: 0,
  });
}

async function AddPlayerToDatabase(code: string, name: string) {
  const playersRef = ref(rtdb, `activeGames/${code}/players`);
  const newPlayerRef = await push(playersRef);
  if (!newPlayerRef.key) {
    //throw error
    return;
  }

  await set(newPlayerRef, name);
}

async function AddTestPlayer(code: string, name: string) {
  const playersRef = ref(rtdb, `activeGames/${code}/players/testPlayer`);
  await set(playersRef, name);
}

export default submitGuestNameCreateGame;
