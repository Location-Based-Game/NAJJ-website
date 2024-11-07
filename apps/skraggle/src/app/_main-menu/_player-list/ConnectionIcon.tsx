import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SignalHigh, CircleAlert, Loader2 } from "lucide-react";
import React from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface ConnectionIcon {
  peerId: string;
  name: string;
}

type StatusIndicator = {
  icon: React.ReactNode;
  tooltip: string;
  tooltipStyling: string;
};

export default function ConnectionIcon({ peerId, name }: ConnectionIcon) {
  const peerStatus = useSelector((state:RootState) => state.peerStatus)
  const { playerId } = useSelector((state: RootState) => state.logIn);
  
  let statusIndicator: StatusIndicator = {
    icon: <></>,
    tooltip: "",
    tooltipStyling: "bg-secondary text-secondary-foreground",
  };

  switch (peerStatus[peerId]) {
    case "connected":
      statusIndicator.icon = (
        <SignalHigh
          id={`connected-${name}`}
          size={18}
          className="w-5 stroke-green-500"
        />
      );
      statusIndicator.tooltip = `connected to ${name}`;
      statusIndicator.tooltipStyling = "bg-primary text-primary-foreground";
      break;
    case "not connected":
      statusIndicator.icon = (
        <SignalHigh
          id={`not-connected-${name}`}
          size={18}
          className="w-5 stroke-gray-700"
        />
      );
      statusIndicator.tooltip = `not connected to ${name}`;
      break;
    case "pending":
      statusIndicator.icon = (
        <Loader2
          id={`pending-${name}`}
          size={18}
          className="w-5 animate-spin"
        />
      );
      statusIndicator.tooltip = `connecting to ${name}`;
      break;
    case undefined:
    case "error":
      statusIndicator.icon = (
        <CircleAlert
          id={`error-${name}`}
          size={16}
          className="w-5 stroke-destructive"
        />
      );
      statusIndicator.tooltip = `unable to connect to ${name}`;
      statusIndicator.tooltipStyling =
        "bg-destructive text-destructive-foreground";
      break;
  }

  if (peerId === playerId) {
    statusIndicator.icon = (
      <SignalHigh
        id={`connected-${name}`}
        size={18}
        className="w-5 stroke-green-500"
      />
    );
    statusIndicator.tooltip = "connected!";
    statusIndicator.tooltipStyling = "bg-primary text-primary-foreground";
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{statusIndicator.icon}</TooltipTrigger>
        <TooltipContent
          className={`drop-shadow-md ${statusIndicator.tooltipStyling}`}
        >
          <p>{statusIndicator.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
