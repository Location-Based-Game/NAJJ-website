import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Loader2 } from "lucide-react";

export default function Rejoining() {
  return (
    <InnerPanelWrapper>
      <div className="flex items-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <h2>Rejoining Game...</h2>
      </div>
    </InnerPanelWrapper>
  );
}
