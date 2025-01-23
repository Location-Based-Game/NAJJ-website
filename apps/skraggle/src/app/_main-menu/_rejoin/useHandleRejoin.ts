import useChannel from "@/hooks/useChannel";
import useLogOut from "@/hooks/useLogOut";
import { fetchApi } from "@/lib/fetchApi";
import { setJoinCode } from "@/store/joinCodeSlice";
import { LogInType, setLogInSession } from "@/store/logInSlice";
import { mainMenuState } from "@/store/store";
import { rejoinSchema } from "@schemas/rejoinSchema";
import { useRef } from "react";
import { useDispatch } from "react-redux";

const tabID = Date.now();

export function useHandleRejoin() {
  const { logOutOnError } = useLogOut();
  const dispatch = useDispatch();
  const canRejoin = useRef(true);

  const { broadcast: broadcastCannotRejoin } = useChannel<number>({
    channelName: "cannot-rejoin",
    messageHandler: (message: MessageEvent<number>) => {
      if (message.data === tabID) return;
      canRejoin.current = false;
    },
  });

  const { broadcast: broadcastJoin } = useChannel<number>({
    channelName: "main-tab",
    messageHandler: (message: MessageEvent<number>) => {
      canRejoin.current = true;
      if (message.data === tabID) return;
      if (message.data > tabID) {
        broadcastCannotRejoin(tabID);
      }
    },
  });

  const handleRejoin = async (): Promise<boolean> => {
    broadcastJoin(tabID);
    await sleep(1000);
    if (!canRejoin.current) {
      return false;
    }

    const res = await fetchApi("rejoin").catch((error) => {
      logOutOnError(error);
    });

    const { gameId, playerId, playerName, isHost } = rejoinSchema.parse(res);

    const sessionData: LogInType = {
      loading: false,
      gameId,
      playerId,
      playerName,
    };

    dispatch(setLogInSession(sessionData));
    dispatch(setJoinCode(sessionData.gameId));

    if (isHost) {
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
    return true;
  };

  return { handleRejoin };
}

async function sleep(time: number) {
  await new Promise((res) => {
    setTimeout(() => {
      res({});
    }, time);
  });
}
