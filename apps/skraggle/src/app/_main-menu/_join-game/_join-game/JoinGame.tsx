import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import usePanelTransition from "@/hooks/usePanelTransition";
import LeaveGameDialogue from "./LeaveGameDialogue";
import { useState } from "react";
import PlayerList from "../../PlayerList";
import { rtdb } from "@/app/firebaseConfig";
import { RootState } from "@/state/store";
import { ref, remove, child } from "firebase/database";
import { useSelector } from "react-redux";

export default function JoinGame() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();
  const guestName = useSelector((state: RootState) => state.guestName);
  const currentJoinCode = useSelector((state:RootState) => state.joinCode)

  const handleOnLeave = () => {
    animationCallback({
      state: "Sign In to Join",
      slideFrom: "left",
    });

    //remove player from game
    if (!guestName.key) return;
    const playersRef = ref(rtdb, `activeGames/${currentJoinCode.code}/players`);
    remove(child(playersRef, guestName.key));
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
      <Button
        disabled={!enableButtons}
        className="h-12 w-full"
      >
        Ready!
      </Button>
    </InnerPanelWrapper>
  );
}