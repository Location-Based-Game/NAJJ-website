import { RootState } from "@/store/store";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { QRCode as CreateQRCode } from "react-qrcode-logo";
import { Button } from "@/components/ui/button";
import { Link, QrCode as QRCodeIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const JoinCode = memo(() => {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  return <JoinCodeView gameId={gameId} />;
});

JoinCode.displayName = "QRCode";

export default JoinCode;

interface JoinCodeView {
  gameId: string;
}

export function JoinCodeView({ gameId }: JoinCodeView) {
  const url = useMemo(() => {
    return window.location.origin;
  }, []);

  const [inviteTooltipOpen, setInviteTooltipOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="pointer-events-auto w-full flex items-center gap-2 rounded-md bg-black/30 px-4 py-2 text-white">
      <div className="grow translate-y-[2px]">
        <div className="text-xs opacity-60">JOIN CODE</div>
        <div className="mt-[-.4rem] text-[1.4rem] font-bold">{gameId}</div>
      </div>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-fit p-1 transition-colors hover:bg-black/30 hover:text-white"
              >
                <QRCodeIcon />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Share QR Code</TooltipContent>
        </Tooltip>
        <PopoverContent className="w-fit p-0">
          <CreateQRCode
            ecLevel="M"
            qrStyle="fluid"
            fgColor="#1f1f1f"
            value={`${url}?code=${gameId}`}
          />
        </PopoverContent>
      </Popover>
      <Tooltip
        open={inviteTooltipOpen}
        onOpenChange={(open) => {
          if (isCopied && open) {
            setIsCopied(false);
          }
          setInviteTooltipOpen(open);
        }}
      >
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="h-fit p-1 transition-colors hover:bg-black/30 hover:text-white"
            onClick={() => {
              setInviteTooltipOpen(true);
              setIsCopied(true);
              navigator.clipboard.writeText(`${url}?code=${gameId}`);
            }}
          >
            <Link />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isCopied ? "Copied!" : "Copy Invite Link"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
