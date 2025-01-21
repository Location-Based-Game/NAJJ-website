import useLogOut from "@/hooks/useLogOut";
import { Button } from "@/components/ui/button";
import { useLeaveGame } from "@/app/LeaveGameProvider";

export default function LeaveGame() {
  const { setOpenDialogue, onLeave } = useLeaveGame();
  const { leaveGame } = useLogOut();

  return (
    <Button
      variant="secondary"
      className="h-12 w-full"
      onClick={() => {
        onLeave.current = async () => {
          await leaveGame("Sign In to Join");
        };
        setOpenDialogue(true);
      }}
    >
      Leave Game
    </Button>
  );
}
