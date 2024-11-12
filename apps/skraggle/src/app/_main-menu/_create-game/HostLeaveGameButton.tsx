import { Button } from "@/components/ui/button";
import { useLeaveGame } from "@/app/LeaveGameProvider";
import useLogOut from "@/hooks/useLogOut";

export default function HostLeaveGameButton() {
  const { setOpenDialogue, onLeave } = useLeaveGame();
  const { leaveGame } = useLogOut();

  return (
    <Button
      variant="outline"
      className="h-12 w-full"
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
