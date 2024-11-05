import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Instance } from "simple-peer";
import { SignalHigh, CircleAlert, Loader2 } from "lucide-react";
import { PeerStatus } from "@/app/_unity-player/useWebRTC";
import React from "react";

interface ConnectionIcon {
  peerStatus: PeerStatus | "Main Player" | undefined;
  name: string;
}

type StatusIndicator = {
  icon: React.ReactNode;
  tooltip: string;
  tooltipStyling: string;
};

export default function ConnectionIcon({ peerStatus, name }: ConnectionIcon) {
  let statusIndicator: StatusIndicator = {
    icon: <></>,
    tooltip: "",
    tooltipStyling: "bg-secondary text-secondary-foreground",
  };

  switch (peerStatus) {
    case "Main Player":
      statusIndicator.icon = (
        <SignalHigh size={18} className="stroke-green-500" />
      );
      statusIndicator.tooltip = "connected!";
      statusIndicator.tooltipStyling = "bg-primary text-primary-foreground"
      break;
    case "connected":
      statusIndicator.icon = (
        <SignalHigh size={18} className="stroke-green-500" />
      );
      statusIndicator.tooltip = `connected to ${name}!`;
      statusIndicator.tooltipStyling = "bg-primary text-primary-foreground"
      break;
    case "not connected":
      statusIndicator.icon = (
        <SignalHigh size={18} className="stroke-gray-700-500" />
      );
      statusIndicator.tooltip = `not connected to ${name}!`;
      break;
    case "pending":
      statusIndicator.icon = (
        <Loader2 size={18} className="mr-2 animate-spin" />
      );
      statusIndicator.tooltip = `connecting to ${name}`;
      break;
    case undefined:
      statusIndicator.icon = (
        <CircleAlert size={16} className="stroke-destructive" />
      );
      statusIndicator.tooltip = `unable to connect to ${name}`;
      statusIndicator.tooltipStyling = "bg-destructive text-destructive-foreground"
      break;
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
