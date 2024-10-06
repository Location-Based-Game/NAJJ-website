import {
  get,
  ref,
  getDatabase,
  child,
  push,
  set,
  DataSnapshot,
} from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { FormSchema } from "../GuestNameInput";
import { useDispatch, useSelector } from "react-redux";
import { setGuestKey } from "@/state/GuestNameSlice";
import { RootState } from "@/state/store";
import { MainMenuState } from "@/hooks/usePanelUI";

export type SubmitGuestNameType = typeof submitGuestName;

const submitGuestName = (
  setEnableButtons: React.Dispatch<React.SetStateAction<boolean>>,
  animationCallback: (state: MainMenuState) => void,
) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const currentJoinCode = useSelector((state:RootState) => state.joinCode)

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);
    const dbRef = ref(getDatabase());

    const snapshot = await get(child(dbRef, `activeGames/${currentJoinCode.code}`));
    if (snapshot.exists()) {
      await AddPlayerToDatabase(snapshot, values);
      return;
    } else {
      toast({
        title: "Error",
        description: "Game not available! Try entering a different code.",
      });
      animationCallback({ state: "Enter Join Code", slideFrom: "left" });
    }
    setEnableButtons(true);
  };

  async function AddPlayerToDatabase(
    snapshot: DataSnapshot,
    values: z.infer<typeof FormSchema>,
  ) {
    const playersRef = ref(rtdb, `activeGames/${currentJoinCode.code}/players`);

    if (Object.values(snapshot.val().players).length >= 8) {
      animationCallback({ state: "Home", slideFrom: "left" });
      return;
    }

    const newPlayerRef = await push(playersRef);
    if (!newPlayerRef.key) {
      //throw error
      return;
    }

    await set(newPlayerRef, values.guestName);
    dispatch(setGuestKey(newPlayerRef.key));
    animationCallback({ state: "Join Game", slideFrom: "right" });
  }

  return { handleSubmit };
};

export default submitGuestName;
