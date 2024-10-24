import useLogOutOnError from "@/hooks/useLogOutOnError";
import { fetchApi } from "@/lib/fetchApi";
import { sessionSchema } from "@/schemas/sessionSchema";
import { setJoinCode } from "@/store/joinCodeSlice";
import { LogInType, setLogInSession } from "@/store/logInSlice";
import { mainMenuState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useSessionRejoin() {
  const dispatch = useDispatch();
  const { logOutOnError } = useLogOutOnError();

  useEffect(() => {
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session_data="))
      ?.split("=")[1];

    if (!sessionCookie) return;

    dispatch(
      mainMenuState.updateState({
        state: "Rejoining",
        slideFrom: "right",
      }),
    );

    handleRejoin();
  }, []);

  const handleRejoin = async () => {
    try {
      const res = await fetchApi("/api/rejoin");

      const { gameId, playerId, playerName } = sessionSchema.parse(res.data);
      const sessionData: LogInType = {
        loading: false,
        gameId,
        playerId,
        playerName,
      };
  
      dispatch(setLogInSession(sessionData));
      dispatch(setJoinCode(sessionData.gameId));
  
      if (res.isHost) {
        dispatch(
          mainMenuState.updateState({
            state: "Create Game",
            slideFrom: "right",
          }),
        );
      } else {
        dispatch(
          mainMenuState.updateState({
            state: "Join Game",
            slideFrom: "right",
          }),
        );
      }
    } catch (error) {
      logOutOnError(error);
    }

  };
}
