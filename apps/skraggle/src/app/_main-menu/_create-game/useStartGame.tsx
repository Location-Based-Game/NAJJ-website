import { setGameActive } from "@/state/GameStateSlice";
import { setJoinCode } from "@/state/JoinCodeSlice";
import { RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { get, ref, set } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { useGetPlayers } from "@/components/GetPlayers";
import { useUnityReactContext } from "@/app/UnityPlayer";
import { useEffect } from "react";
import { MainMenuState } from "@/hooks/usePanelUI";
import setGameState from "@/firebase/setGameState";

export default function useStartGame(
  animationCallback: (state: MainMenuState, error?: string) => void,
) {
  const dispatch = useDispatch();
  const currentCreateCode = useSelector((state: RootState) => state.createCode);
  const { key } = useSelector((state: RootState) => state.guestName);
  const { playerData } = useGetPlayers();
  const { sendMessage } = useUnityReactContext();

  const handleError = () => {
    animationCallback(
      {
        state: "Home",
        slideFrom: "left",
      },
      "Join code does not exist",
    );
  };

  useEffect(() => {
    if (!currentCreateCode.code) {
      handleError();
    }
  }, []);

  const handleStartGame = async () => {
    if (currentCreateCode.code) {
      dispatch(setJoinCode(currentCreateCode.code));
      dispatch(setGameActive(true));
      
      try {
        await setGameState(currentCreateCode.code, "TurnsDiceRoll")
      } catch (error) {
        console.error(error)
      }

      const body = {
        gameId: currentCreateCode.code,
        playerIds: Object.keys(playerData),
      };

      await fetch("/api/create-turn-numbers", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const diceDataRef = ref(
        rtdb,
        `activeGames/${currentCreateCode.code}/initialDiceData`,
      );

      const diceDataSnapshot = await get(diceDataRef);
      if (diceDataSnapshot.exists()) {
        let playerKey:string = ""
        if (
          process.env.NODE_ENV === "development" &&
          process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
        ) {
          playerKey = "testPlayer"
        } else {
          playerKey = key
        }

        const { dice1, dice2 } = diceDataSnapshot.val()[playerKey];
        sendMessage("Receiver", "CreateStartingDice", dice1);
        sendMessage("Receiver", "CreateStartingDice", dice2);
      } else {
        console.error("No data available");
      }
    } else {
      handleError();
    }
  };

  return { handleStartGame };
}
