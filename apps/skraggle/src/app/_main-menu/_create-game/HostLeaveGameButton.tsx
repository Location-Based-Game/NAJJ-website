import { Button } from "@/components/ui/button";
import { useLeaveGame } from "@/app/LeaveGameProvider";
import useLogOut from "@/hooks/useLogOut";

export default function HostLeaveGameButton() {
  const { setOpenDialogue, onLeave } = useLeaveGame();
  const { leaveGame } = useLogOut();

  return (
    <Button
      variant="secondary"
      className="h-12 basis-0 grow relative"
      onClick={() => {
        onLeave.current = async () => {
          await leaveGame("Home");
        };
        setOpenDialogue(true);
      }}
    >
      Leave Game
    </Button>
  );
}
