import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import usePanelTransition from "@/hooks/usePanelTransition";
import { useState } from "react";
import PlayerList from "../PlayerList";
import LeaveGame from "./LeaveGame";

export default function JoinGame() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();

  return (
    <InnerPanelWrapper ref={scope}>
      <LeaveGame animationCallback={animationCallback}/>
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
