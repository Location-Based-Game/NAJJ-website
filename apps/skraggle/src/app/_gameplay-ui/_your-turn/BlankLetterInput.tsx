import { useRef } from "react";
import panelStyles from "@styles/panel.module.css";
import { cn } from "@/lib/tailwindUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function BlankLetterInput() {
  const trigger = useRef<HTMLSpanElement>(null!);
  const button = useRef<HTMLButtonElement>(null!);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    trigger.current.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: event.clientX,
        clientY: event.clientY,
      }),
    );
  };

  return (
    <>
      <Button ref={button} onClick={handleMenuOpen}>
        Open Context Menu
      </Button>
      <ContextMenu>
        <ContextMenuTrigger ref={trigger} />
        <ContextMenuContent
          className={cn(
            panelStyles.woodBorder,
            "pointer-events-auto absolute z-20 w-[15rem] border-none text-white",
          )}
          forceMount
        >
          <div className="flex flex-col gap-2 p-4">
            <h2 className="text-center text-white drop-shadow-dark">
              Enter Custom Letter
            </h2>
            <Input className="text-center text-lg" maxLength={1} />
            <div className={panelStyles.woodBackground}></div>
          </div>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
