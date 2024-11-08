import { useDispatch } from "react-redux";
import { useToast } from "./use-toast";
import type { MainMenuState, MainMenuStates } from "./usePanelUI";
import { mainMenuState } from "@/store/store";
import { resetClientSessionData } from "@/store/logInSlice";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { PlayerPeers } from "@/app/_unity-player/useWebRTC";
import { fetchApi } from "@/lib/fetchApi";

const defaultState: MainMenuState = {
  state: "Home",
  slideFrom: "left",
};

export default function useLogOut(disconnectPeers: boolean = true) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  let playerPeers: React.MutableRefObject<PlayerPeers>;

  if (disconnectPeers) {
    // eslint-disable-next-line
    playerPeers = useUnityReactContext().playerPeers;
  }

  const disconnectWebRTCPeers = () => {
    if (playerPeers) {
      Object.keys(playerPeers.current).forEach((key) => {
        playerPeers.current[key].destroy(new Error(`disconnected from ${key}`));
      });
    }
  }

  const logOutOnError = (
    error: unknown,
    state: MainMenuState = defaultState,
  ) => {
    console.error(error);
    setTimeout(() => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${error}`.replace("Error: ", ""),
      });
    }, 100);

    dispatch(resetClientSessionData());
    dispatch(mainMenuState.updateState(state));

    disconnectWebRTCPeers()
  };

  const leaveGame = async (state: MainMenuStates) => {
    try {
      dispatch(resetClientSessionData());
      await fetchApi("/api/leave-game");
      disconnectWebRTCPeers()
      dispatch(
        mainMenuState.updateState({
          state,
          slideFrom: "left",
        }),
      );
    } catch (error) {
      logOutOnError(error, {
        state: "Home",
        slideFrom: "left",
      });
    }
  };

  return { logOutOnError, leaveGame };
}
