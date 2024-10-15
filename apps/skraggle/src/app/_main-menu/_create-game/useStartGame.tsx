import { setGameActive } from "@/store/gameStateSlice";
import { setJoinCode } from "@/store/joinCodeSlice";
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
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
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
    if (!gameId) {
      handleError("Join code does not exist");
    }
  }, [gameId]);

  const handleStartGame = async () => {
    try {
      dispatch(setJoinCode(gameId));
      dispatch(setGameActive(true));

      await setGameState({
        gameId,
        gameState: "TurnsDiceRoll",
      });

      await createTurnNumbers({
        gameId,
        playerIds: Object.keys(playerData),
      });

      const diceData = await getStartingDice({
        gameId,
        playerId,
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
