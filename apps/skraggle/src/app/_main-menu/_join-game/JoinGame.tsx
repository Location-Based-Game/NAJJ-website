import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import usePanelTransition from "@/hooks/usePanelTransition";
import { useEffect } from "react";
import PlayerList from "../_player-list/PlayerList";
import LeaveGame from "./LeaveGame";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";

export default function JoinGame() {
  const { scope, animationCallback } = usePanelTransition();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const { toast } = useToast();
  const { loadingProgression } = useUnityReactContext();

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
      <div className="relative inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-md border-2 border-border text-sm font-medium text-secondary-foreground transition-colors">
        <div
          className="absolute left-0 h-full w-full origin-left rounded-md bg-secondary transition-transform duration-300"
          style={{ transform: `scaleX(${loadingProgression})` }}
        ></div>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <div className="z-10">
          {loadingProgression === 1 ? "Waiting for Host" : "Loading Game"}
        </div>
      </div>
    </InnerPanelWrapper>
  );
}
