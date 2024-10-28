import { useDispatch } from "react-redux";
import { useToast } from "./use-toast";
import type { MainMenuState } from "./usePanelUI";
import { mainMenuState } from "@/store/store";
import { resetClientSessionData } from "@/store/logInSlice";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { PlayerPeers } from "@/app/_unity-player/useWebRTC";

const defaultState: MainMenuState = {
  state: "Home",
  slideFrom: "left",
};

export default function useLogOutOnError(disconnectPeers: boolean = true) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  let playerPeers: React.MutableRefObject<PlayerPeers>;

  if (disconnectPeers) {
    // eslint-disable-next-line
    playerPeers = useUnityReactContext().playerPeers;
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

    //disconnect all webRTC peers
    if (playerPeers) {
      Object.keys(playerPeers.current).forEach((key) => {
        playerPeers.current[key].destroy(new Error(`disconnected from ${key}`));
      });
    }
  };

  return { logOutOnError };
}
