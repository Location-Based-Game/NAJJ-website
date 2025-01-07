import { useDispatch } from "react-redux";
import { useToast } from "./use-toast";
import { MainMenuState, mainMenuState, MainMenuStates } from "@/store/store";
import { resetClientSessionData } from "@/store/logInSlice";
import { fetchApi } from "@/lib/fetchApi";
import { setGameState, setGameActive } from "@/store/gameStateSlice";
import { resetTurnState } from "@/store/turnSlice";
import { playerPeers } from "@/app/_gameplay-ui/useWebRTC";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";

const defaultState: MainMenuState = {
  state: "Home",
  slideFrom: "left",
};

export default function useLogOut() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { callUnityFunction } = useUnityReactContext();

  const disconnectWebRTCPeers = () => {
    Object.keys(playerPeers.value).forEach((key) => {
      playerPeers.value[key].destroy(new Error(`disconnected from ${key}`));
    });
  };

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
    dispatch(setGameState("Menu"));
    dispatch(setGameActive(false));
    dispatch(resetTurnState());
    disconnectWebRTCPeers();
    callUnityFunction("ResetGame");
  };

  const leaveGame = async (state: MainMenuStates = "Home") => {
    try {
      dispatch(resetClientSessionData());
      await fetchApi("leaveGame");
      disconnectWebRTCPeers();
      dispatch(
        mainMenuState.updateState({
          state,
          slideFrom: "left",
        }),
      );
      dispatch(setGameState("Menu"));
      dispatch(setGameActive(false));
      dispatch(resetTurnState());
      callUnityFunction("ResetGame");
    } catch (error) {
      logOutOnError(error);
    }
  };

  return { logOutOnError, leaveGame };
}
