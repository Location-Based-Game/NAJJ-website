import type { AnimationCallback } from "@/hooks/usePanelTransition";
import { fetchApi } from "@/lib/fetchApi";
import { resetClientSessionData } from "@/store/logInSlice";
import LeaveGameDialogue from "../LeaveGameDialogue";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import useLogOutOnError from "@/hooks/useLogOutOnError";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";

export default function HostLeaveGameButton({
  animationCallback,
}: {
  animationCallback: AnimationCallback;
}) {
  const dispatch = useDispatch();
  const { playerPeers } = useUnityReactContext();
  const { logOutOnError } = useLogOutOnError();

  const handleLeaveGame = async () => {
    try {
      dispatch(resetClientSessionData());
      await fetchApi("/api/leave-game");
      Object.keys(playerPeers.current).forEach((key) => {
        playerPeers.current[key].destroy(new Error(`disconnected from ${key}`));
      });
      animationCallback({
        state: "Home",
        slideFrom: "left",
      });
    } catch (error) {
      logOutOnError(error, {
        state: "Sign In to Create",
        slideFrom: "left",
      });
    }
  };

  return (
    <LeaveGameDialogue
      onLeave={() => {
        handleLeaveGame();
      }}
    >
      <Button variant="outline" className="h-12 w-full">
        Leave Game
      </Button>
    </LeaveGameDialogue>
  );
}
