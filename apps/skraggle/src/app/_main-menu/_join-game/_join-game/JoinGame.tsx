import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import usePanelTransition from "@/hooks/usePanelTransition";
import LeaveGameDialogue from "./LeaveGameDialogue";
import { useState } from "react";
import PlayerList from "../../PlayerList";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import removePlayer from "@/actions/removePlayer";

export default function JoinGame() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();
  const guestName = useSelector((state: RootState) => state.guestName);
  const currentJoinCode = useSelector((state: RootState) => state.joinCode);

  const handleOnLeave = async () => {
    animationCallback({
      state: "Sign In to Join",
      slideFrom: "left",
    });
    try {
      await removePlayer({
        gameId: currentJoinCode.code,
        playerKey: guestName.key,
      });
    } catch (error) {
      console.error(error);
    }
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
        <PlayerList joinCode={currentJoinCode.code} />
      </div>
      <Button disabled={!enableButtons} className="h-12 w-full">
        Ready!
      </Button>
    </InnerPanelWrapper>
  );
}
