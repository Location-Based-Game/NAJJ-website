import { setJoinCode } from "@/store/joinCodeSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { MainMenuState } from "@/hooks/usePanelUI";
import { fetchApi } from "@/lib/fetchApi";

export default function useStartGame(
  animationCallback: (state: MainMenuState, error?: string) => void,
) {
  const dispatch = useDispatch();
  const { gameId, } = useSelector((state: RootState) => state.logIn);

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
  }, []);

  const handleStartGame = async () => {
    try {
      dispatch(setJoinCode(gameId));
      await fetchApi("/api/start-game");
    } catch (error) {
      handleError(`${error}`);
    }
  };

  return { handleStartGame };
}
