import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import usePanelTransition from "@/hooks/usePanelTransition";
import LeaveGameDialogue from "../LeaveGameDialogue";
import { useState } from "react";
import PlayerList from "../PlayerList";
import { useDispatch } from "react-redux";
import { resetClientSessionData } from "@/store/logInSlice";
import { fetchApi } from "@/lib/fetchApi";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";

export default function JoinGame() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();
  const { playerPeers } = useUnityReactContext();
  const dispatch = useDispatch();

  const handleOnLeave = async () => {
    try {
      await fetchApi("/api/leave-game");
      Object.keys(playerPeers.current).forEach((key) => {
        playerPeers.current[key].destroy(new Error(`disconnected from ${key}`));
      });
    } catch (error) {
      console.error(error);
    }
    dispatch(resetClientSessionData());
    animationCallback({
      state: "Sign In to Join",
      slideFrom: "left",
    });
  };

  return (
    <InnerPanelWrapper ref={scope}>
      <LeaveGameDialogue
        onLeave={() => {
          handleOnLeave();
        }}
      />
      <div className="w-full grow">
        <h2 className="my-6 w-full text-center">Players</h2>
        <PlayerList />
      </div>
      <Button disabled={!enableButtons} className="h-12 w-full">
        Ready!
      </Button>
    </InnerPanelWrapper>
  );
}
