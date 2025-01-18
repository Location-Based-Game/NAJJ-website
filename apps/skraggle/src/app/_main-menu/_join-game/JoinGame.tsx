import { useEffect } from "react";
import PlayerList from "../_player-list/PlayerList";
import LeaveGame from "./LeaveGame";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { mainMenuState, RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { Progress } from "@/components/ui/progress";

export default function JoinGame() {
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const { toast } = useToast();
  const { loadingProgression, splashScreenComplete } = useUnityReactContext();
  const dispatch = useDispatch();

  useEffect(() => {
    const hostRef = ref(rtdb, `activeGames/${gameId}/host`);
    const unsubscribe = onValue(hostRef, (snapshot) => {
      if (!snapshot.exists()) return;
      if (snapshot.val() === playerId) {
        toast({
          title: "Host left the game",
          description: "You are now the host",
        });
        dispatch(
          mainMenuState.updateState({
            state: "Sign In to Create",
            slideFrom: "right",
          }),
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <LeaveGame />
      <div className="w-full grow">
        <PlayerList />
      </div>
      <div className="relative inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-md border-2 border-border text-sm font-medium text-secondary-foreground transition-colors">
        <Progress
          className="absolute left-0 h-full rounded-none"
          classNameIndicator="bg-secondary"
          value={loadingProgression}
        />
        {loadingProgression === 1 && splashScreenComplete ? (
          <div className="z-10 animate-pulse">Waiting for Host</div>
        ) : (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <div className="z-10">Loading Game</div>
          </>
        )}
      </div>
    </>
  );
}
