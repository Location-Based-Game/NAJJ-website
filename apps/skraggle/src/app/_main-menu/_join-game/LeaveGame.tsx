import LeaveGameDialogue from "../LeaveGameDialogue";
import useLogOut from "@/hooks/useLogOut";
import { Button } from "@/components/ui/button";

export default function LeaveGame() {
  const { leaveGame } = useLogOut();

  return (
    <LeaveGameDialogue
      onLeave={() => {
        leaveGame("Sign In to Join");
      }}
    >
      <Button variant="outline" className="h-12 w-full">
        Leave Game
      </Button>
    </LeaveGameDialogue>
  );
}
