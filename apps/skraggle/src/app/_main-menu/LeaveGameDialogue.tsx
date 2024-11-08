import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface LeaveGameDialogue {
  onLeave: () => void;
  children: React.ReactNode;
  onCancel?: () => void;
  triggerDialogue?: boolean;
}

export default function LeaveGameDialogue({
  onLeave,
  children,
  onCancel = () => {},
  triggerDialogue = true,
}: LeaveGameDialogue) {
  if (!triggerDialogue) {
    return children;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Game?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be removed from this room.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onLeave();
            }}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
