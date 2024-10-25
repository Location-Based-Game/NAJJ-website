import { setJoinCode } from "@/store/joinCodeSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchApi } from "@/lib/fetchApi";
import useLogOutOnError from "@/hooks/useLogOutOnError";

export default function useStartGame() {
  const dispatch = useDispatch();
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { logOutOnError } = useLogOutOnError();

  useEffect(() => {
    if (!gameId) {
      logOutOnError("Join code does not exist");
    }
  }, []);

  const handleStartGame = async () => {
    try {
      dispatch(setJoinCode(gameId));
      await fetchApi("/api/start-game");
    } catch (error) {
      logOutOnError(error);
    }
  };

  return { handleStartGame };
}
