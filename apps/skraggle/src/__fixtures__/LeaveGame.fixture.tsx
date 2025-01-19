"use client";
import { LeaveGameView } from "@/app/LeaveGameProvider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default () => {
  const [openDialogue, setOpenDialogue] = useState(false);
  const [enableButtons, setEnableButtons] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setEnableButtons(true);
          setOpenDialogue(true);
        }}
      >
        Leave Game
      </Button>
      <LeaveGameView
        openDialogue={openDialogue}
        handleCancel={() => setOpenDialogue(false)}
        handleAction={async () => {
          setEnableButtons(false);
          setTimeout(() => {
            setOpenDialogue(false);
          }, 1500);
        }}
        enableButtons={enableButtons}
      />
    </>
  );
};
