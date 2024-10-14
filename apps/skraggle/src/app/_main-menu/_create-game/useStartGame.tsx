import { setGameActive } from "@/store/GameStateSlice";
import { setJoinCode } from "@/store/JoinCodeSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useGetPlayers } from "@/components/GetPlayers";
import { useUnityReactContext } from "@/app/UnityPlayer";
import { useEffect } from "react";
import { MainMenuState } from "@/hooks/usePanelUI";
import setGameState from "@/server-actions/setGameState";
import { createTurnNumbers } from "@/server-actions/createTurnNumbers";
import getStartingDice from "@/server-actions/getStartingDice";

export default function useStartGame(
  animationCallback: (state: MainMenuState, error?: string) => void,
) {
  const dispatch = useDispatch();
  const currentCreateCode = useSelector((state: RootState) => state.createCode);
  const { key } = useSelector((state: RootState) => state.guestName);
  const { playerData } = useGetPlayers();
  const { sendMessage } = useUnityReactContext();

  const handleError = (error: string) => {
    animationCallback(
      {
        state: "Home",
        slideFrom: "left",
      },
      error,
    );
  };

  useEffect(() => {
    console.log(currentCreateCode)
    if (!currentCreateCode.code) {
      // handleError("Join code does not exist");
    }
  }, [currentCreateCode.code]);

  const handleStartGame = async () => {
    try {
      dispatch(setJoinCode(currentCreateCode.code));
      dispatch(setGameActive(true));

      await setGameState({
        gameId: currentCreateCode.code,
        gameState: "TurnsDiceRoll",
      });

      await createTurnNumbers({
        gameId: currentCreateCode.code,
        playerIds: Object.keys(playerData),
      });

      const diceData = await getStartingDice({
        gameId: currentCreateCode.code,
        playerKey: key,
      });

      const { dice1, dice2 } = diceData;

      sendMessage("Receiver", "CreateStartingDice", dice1);
      sendMessage("Receiver", "CreateStartingDice", dice2);
    } catch (error) {
      handleError(`${error}`);
    }
  };

  return { handleStartGame };
}
