import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import usePanelTransition from "@/hooks/usePanelTransition";
import { useEffect, useState } from "react";
import PlayerList from "../_player-list/PlayerList";
import LeaveGame from "./LeaveGame";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";

export default function JoinGame() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const { toast } = useToast();

  useEffect(() => {
    const hostRef = ref(rtdb, `activeGames/${gameId}/host`);
    const unsubscribe = onValue(hostRef, (snapshot) => {
      if (!snapshot.exists()) return;
      if (snapshot.val() === playerId) {
        toast({
          title: "Host left the game",
          description: "You are now the host",
        });
        animationCallback({
          state: "Sign In to Create",
          slideFrom: "right",
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <InnerPanelWrapper ref={scope}>
      <LeaveGame animationCallback={animationCallback} />
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
