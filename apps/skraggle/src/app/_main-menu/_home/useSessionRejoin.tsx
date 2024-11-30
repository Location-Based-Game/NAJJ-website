import useLogOut from "@/hooks/useLogOut";
import { fetchApi } from "@/lib/fetchApi";
import { sessionSchema } from "../../../schemas/sessionSchema";
import { setJoinCode } from "@/store/joinCodeSlice";
import { LogInType, setLogInSession } from "@/store/logInSlice";
import { mainMenuState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";

const rejoinSchema = sessionSchema.extend({
  isHost: z.boolean().optional()
})

export default function useSessionRejoin() {
  const dispatch = useDispatch();
  const { logOutOnError } = useLogOut();

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
      const res = await fetchApi("rejoin");

      const { gameId, playerId, playerName } = rejoinSchema.parse(res);
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
