"use client";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useState, createContext, useContext, useRef, useEffect } from "react";

interface LeaveGameContextType {
  setOpenDialogue: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: React.MutableRefObject<() => void>;
  onLeave: React.MutableRefObject<() => void>;
}

const LeaveGameContext = createContext<LeaveGameContextType | null>(null);

interface LeaveGameProvider {
  children: React.ReactNode;
}

export default function LeaveGameProvider({ children }: LeaveGameProvider) {
  const [openDialogue, setOpenDialogue] = useState(false);
  const onCancel = useRef<() => void>(() => {});
  const onLeave = useRef<() => Promise<void>>(async () => {});
  const [enableButtons, setEnableButtons] = useState(false);

  useEffect(() => {
    setEnableButtons(openDialogue);
  }, [openDialogue]);

  return (
    <LeaveGameContext.Provider value={{ setOpenDialogue, onCancel, onLeave }}>
      <AlertDialog open={openDialogue}>
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
                onCancel.current();
                setOpenDialogue(false);
              }}
              disabled={!enableButtons}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  setEnableButtons(false);
                  await onLeave.current();
                  await new Promise((res) =>
                    setTimeout(() => {
                      res("");
                    }, 200),
                  );
                } finally {
                  setOpenDialogue(false);
                }
              }}
              disabled={!enableButtons}
            >
              {!enableButtons && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </LeaveGameContext.Provider>
  );
}

export function useLeaveGame() {
  const context = useContext(LeaveGameContext);
  if (!context) {
    throw new Error(
      "useLeaveGame must be used within a LeaveGameContext Provider",
    );
  }

  return context;
}
