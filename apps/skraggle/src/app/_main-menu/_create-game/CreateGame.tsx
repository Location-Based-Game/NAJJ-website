import { useEffect } from "react";
import JoinCode from "./JoinCode";
import { Button } from "@/components/ui/button";
import PlayerList from "../_player-list/PlayerList";
import useStartGame from "./useStartGame";
import HostLeaveGameButton from "./HostLeaveGameButton";
import { Loader2 } from "lucide-react";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { Progress } from "@/components/ui/progress";
import { useMenuButtons } from "../InnerPanelWrapper";

export default function CreateGame() {
  const { enableButtons, setEnableButtons } = useMenuButtons();
  const { handleStartGame } = useStartGame();
  const { loadingProgression, splashScreenComplete } = useUnityReactContext();

  useEffect(() => {
    if (loadingProgression === 1 && splashScreenComplete) {
      //prevents start button from being clicked when host rejoins the game
      setTimeout(() => {
        setEnableButtons(true);
      }, 1000);
    }
  }, [loadingProgression, splashScreenComplete]);

  return (
    <>
      <JoinCode />
      <PlayerList />
      <div className="flex w-full gap-4">
        <HostLeaveGameButton />
        {loadingProgression === 1 && splashScreenComplete ? (
          <Button
            disabled={!enableButtons}
            className="h-12 grow basis-0 transition-opacity"
            onClick={() => {
              setEnableButtons(false);
              handleStartGame();
            }}
          >
            Start
          </Button>
        ) : (
          <div className="relative inline-flex h-12 grow basis-0 items-center justify-center whitespace-nowrap rounded-md bg-primary/70 px-4 text-sm font-medium text-primary-foreground transition-colors">
            <Progress
              className="absolute left-0 h-full rounded-md"
              value={loadingProgression}
            />
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <div className="z-10">Loading Game</div>
          </div>
        )}
      </div>
    </>
  );
}
