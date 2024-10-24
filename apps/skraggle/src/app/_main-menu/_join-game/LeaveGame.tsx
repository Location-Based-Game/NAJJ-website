import type { AnimationCallback } from "@/hooks/usePanelTransition";
import { fetchApi } from "@/lib/fetchApi";
import { resetClientSessionData } from "@/store/logInSlice";
import LeaveGameDialogue from "../LeaveGameDialogue";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import useLogOutOnError from "@/hooks/useLogOutOnError";
import { useDispatch } from "react-redux";

export default function LeaveGame({
  animationCallback,
}: {
  animationCallback: AnimationCallback;
}) {
  const { playerPeers } = useUnityReactContext();
  const dispatch = useDispatch();
  const { logOutOnError } = useLogOutOnError();

  const handleOnLeave = async () => {
    try {
      await fetchApi("/api/leave-game");
      Object.keys(playerPeers.current).forEach((key) => {
        playerPeers.current[key].destroy(new Error(`disconnected from ${key}`));
      });
      animationCallback({
        state: "Sign In to Join",
        slideFrom: "left",
      });
      dispatch(resetClientSessionData());
    } catch (error) {
      logOutOnError(error);
    }
  };
  
  return (
    <LeaveGameDialogue
      onLeave={() => {
        handleOnLeave();
      }}
    />
  );
}
