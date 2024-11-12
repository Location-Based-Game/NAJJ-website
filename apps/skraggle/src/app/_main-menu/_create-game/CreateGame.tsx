import usePanelTransition from "@/hooks/usePanelTransition";
import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { useEffect, useState } from "react";
import QRCode from "./QRCode";
import { Button } from "@/components/ui/button";
import PlayerList from "../_player-list/PlayerList";
import useStartGame from "./useStartGame";
import HostLeaveGameButton from "./HostLeaveGameButton";
import { Loader2 } from "lucide-react";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";

export default function CreateGame() {
  const [enableButtons, setEnableButtons] = useState(false);
  const { scope, animationCallback } = usePanelTransition();
  const { handleStartGame } = useStartGame();
  const { loadingProgression, splashScreenComplete } = useUnityReactContext();

  useEffect(() => {
    if (loadingProgression === 1 && splashScreenComplete) {
      //prevents start button from being clicked when host rejoins the game
      setTimeout(() => {
        setEnableButtons(true)
      }, 1000);
    }
  }, [loadingProgression, splashScreenComplete])

  return (
    <InnerPanelWrapper ref={scope}>
      <div className="flex w-full grow gap-8">
        <QRCode />
        <div className="w-full grow">
          <h2 className="my-6 w-full text-center">Players</h2>
          <PlayerList />
        </div>
      </div>
      <div className="flex w-full gap-4">
        <HostLeaveGameButton />
        {loadingProgression === 1 && splashScreenComplete ? (
          <Button
            disabled={!enableButtons}
            className="h-12 w-full transition-opacity"
            onClick={() => {
              setEnableButtons(false);
              handleStartGame();
            }}
          >
            Start
          </Button>
        ) : (
          <div className="relative inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary/70 text-sm font-medium text-primary-foreground transition-colors">
            <div
              className="absolute left-0 h-full w-full origin-left rounded-md bg-primary transition-transform duration-300"
              style={{ transform: `scaleX(${loadingProgression})` }}
            ></div>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <div className="z-10">Loading Game</div>
          </div>
        )}
      </div>
    </InnerPanelWrapper>
  );
}
