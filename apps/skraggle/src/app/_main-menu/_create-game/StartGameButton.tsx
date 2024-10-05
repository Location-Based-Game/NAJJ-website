import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setGameActive } from "@/state/GameStateSlice";
import { setJoinCode } from "@/state/JoinCodeSlice";
import { RootState } from "@/state/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get, ref, set } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { useGetPlayers } from "@/components/GetPlayers";
import { useUnityReactContext } from "@/app/UnityPlayer";

export default function StartGameButton() {
  const [enableButtons, setEnableButtons] = useState(true);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const currentCreateCode = useSelector((state: RootState) => state.createCode);
  const { key } = useSelector((state: RootState) => state.guestName);
  const { playerData } = useGetPlayers();
  const {sendMessage} = useUnityReactContext()

  const handleStartGame = async () => {
    setEnableButtons(false);
    if (currentCreateCode.code) {
      dispatch(setJoinCode(currentCreateCode.code));
      dispatch(setGameActive(true));
      const gameStateRef = ref(rtdb, `activeGames/${currentCreateCode.code}/gameState`)
      await set(gameStateRef, "TurnsDiceRoll")

      const body = {
        gameId: currentCreateCode.code,
        playerIds: Object.keys(playerData)
      }

      await fetch('/api/create-turn-numbers', {
        method: "POST",
        body: JSON.stringify(body)
      })

      const diceDataRef = ref(rtdb, `activeGames/${currentCreateCode.code}/initialDiceData`)

      const diceDataSnapshot = await get(diceDataRef);
      if (diceDataSnapshot.exists()) {
        const {dice1, dice2} = diceDataSnapshot.val()["-O8KmDO6YmKQlkyWvBrn"];
        sendMessage("Receiver", "CreateStartingDice", dice1)
        sendMessage("Receiver", "CreateStartingDice", dice2)
      } else {
        console.log("No data available");
      }
      

    } else {
      console.error("Join code does not exist.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Join code does not exist.",
      });
    }
  };

  return (
    <Button
      disabled={!enableButtons}
      className="h-12 w-full"
      onClick={() => {
        handleStartGame();
      }}
    >
      Start
    </Button>
  );
}
