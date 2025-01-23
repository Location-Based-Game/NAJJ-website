import { Button } from "@/components/ui/button";
import styles from "@styles/panel.module.css";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLeaveGame } from "@/app/LeaveGameProvider";
import useLogOut from "@/hooks/useLogOut";
import { Loader2 } from "lucide-react";
import { useHandleRejoin } from "./useHandleRejoin";

export default function RejoinFailed() {
  const [enableButtons, setEnableButtons] = useState(true);
  const { handleRejoin } = useHandleRejoin();
  const { toast } = useToast();
  const { setOpenDialogue, onLeave } = useLeaveGame();
  const { leaveGame } = useLogOut();

  const handleRetry = async () => {
    setEnableButtons(false);
    const success = await handleRejoin();
    if (!success) {
      toast({
        variant: "destructive",
        title: "Rejoin Failed",
      });
      setEnableButtons(true);
    }
  };

  const handleLeaveGame = () => {
    onLeave.current = async () => {
      await leaveGame("Home");
    };
    setOpenDialogue(true);
  };

  return (
    <RejoinFailedView
      enableButtons={enableButtons}
      handleRetry={handleRetry}
      handleLeaveGame={handleLeaveGame}
    />
  );
}

interface RejoinFailedView {
  enableButtons: boolean;
  handleRetry: () => void;
  handleLeaveGame: () => void;
}

export function RejoinFailedView({
  enableButtons,
  handleRetry,
  handleLeaveGame,
}: RejoinFailedView) {
  return (
    <div className={styles.darkenedBackground}>
      <div className="flex flex-col gap-6 text-white">
        <h2 className="text-lg font-bold drop-shadow-lg">Rejoin Failed</h2>
        <p className="text-md drop-shadow-dark">
          Please make sure the game is open on only{" "}
          <strong className="text-yellow-400">1 tab.</strong> To add another
          player, open another browser or private window.
        </p>
        <div className="flex w-full flex-col gap-2 xs:flex-row xs:gap-4">
          <Button
            disabled={!enableButtons}
            className="w-full"
            variant="secondary"
            onClick={() => {
              handleLeaveGame();
            }}
          >
            Leave Game
          </Button>
          <Button
            disabled={!enableButtons}
            className="w-full"
            onClick={() => handleRetry()}
          >
            {!enableButtons && (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            )}
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
