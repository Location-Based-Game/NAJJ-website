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
import { MainMenuState } from "../../MainMenuPanel";
import { z } from "zod";
import { FormSchema } from "./GuestNameInput";

export default function useSubmitGuestName(
  setEnableButtons: React.Dispatch<React.SetStateAction<boolean>>,
  handleAnimation: (state: MainMenuState) => void,
) {
  const { toast } = useToast();

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);
    const dbRef = ref(getDatabase());

    const snapshot = await get(child(dbRef, `activeGames/jr2p`));
    if (snapshot.exists()) {
      await AddPlayerToDatabase(snapshot, values)
      return;
    } else {
      toast({
        title: "Error",
        description: "Game not available! Try entering a different code.",
      });
      handleAnimation("enter join code");
    }
    setEnableButtons(true);
  };

  async function AddPlayerToDatabase(
    snapshot: DataSnapshot,
    values: z.infer<typeof FormSchema>,
  ) {
    const playersRef = ref(rtdb, `activeGames/jr2p/players`);

    if (Object.values(snapshot.val().players).length >= 8) {
      handleAnimation("main");
      return;
    }

    const newPlayerRef = push(playersRef);
    await set(newPlayerRef, values.guestName);

    handleAnimation("join game");
  }

  return { handleSubmit };
}
