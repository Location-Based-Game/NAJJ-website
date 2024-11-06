import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CrownIcon } from "lucide-react";

interface HostIcon {
  name: string;
}

export default function HostIcon({ name }: HostIcon) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <CrownIcon size={16} />
      </TooltipTrigger>
      <TooltipContent className="bg-secondary text-secondary-foreground drop-shadow-md">
        <p>{name} is the host</p>
      </TooltipContent>
    </Tooltip>
  );
}
