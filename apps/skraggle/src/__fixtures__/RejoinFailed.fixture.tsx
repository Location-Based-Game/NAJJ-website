"use client";

import { RejoinFailedView } from "@/app/_main-menu/_rejoin/RejoinFailed";
import { cn } from "@/lib/tailwindUtils";
import panelStyles from "@styles/panel.module.css";
import { useState } from "react";

export default function RejoinFailedFixture() {
  const [enableButtons, setEnableButtons] = useState(true);
  const handleRetry = () => {
    setEnableButtons(false);
    setTimeout(() => {
      setEnableButtons(true);
    }, 2000);
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div
        className={cn(
          "relative flex items-center justify-center",
          panelStyles.woodBorder,
        )}
        style={{ width: "30rem", padding: "3rem" }}
      >
        <div className={panelStyles.woodBackground}></div>
        <RejoinFailedView
          enableButtons={enableButtons}
          handleRetry={handleRetry}
          handleLeaveGame={() => {}}
        />
      </div>
    </div>
  );
}
