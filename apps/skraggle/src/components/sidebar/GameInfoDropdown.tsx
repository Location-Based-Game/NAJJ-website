"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar/sidebar";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ArrowRightFromLine } from "lucide-react";
import useLogOut from "@/hooks/useLogOut";
import { useState } from "react";
import { useLeaveGame } from "@/app/LeaveGameProvider";
import { cn } from "@/lib/tailwindUtils";
import TileIcon from "../TileIcon";

export function GameInfoDropdown() {
  const { leaveGame } = useLogOut();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { setOpenDialogue, onLeave } = useLeaveGame();
  const { gameId } = useSelector((state: RootState) => state.logIn);

  const onDropdownSelect = (e: Event) => {
    e.preventDefault();
    onLeave.current = async () => {
      setDropdownOpen(false);
      await leaveGame("Home");
    };
    setOpenDialogue(true);
  };

  return (
    <GameInfoDropdownView
      isDropdownOpen={isDropdownOpen}
      setDropdownOpen={setDropdownOpen}
      gameId={gameId}
      onDropdownSelect={onDropdownSelect}
    />
  );
}

interface GameInfoDropdownView {
  isDropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gameId: string;
  onDropdownSelect: (e: Event) => void;
}

export function GameInfoDropdownView({
  isDropdownOpen,
  setDropdownOpen,
  gameId,
  onDropdownSelect,
}: GameInfoDropdownView) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownTrigger gameId={gameId} />
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuItem className="gap-4 p-2" onSelect={onDropdownSelect}>
              <ArrowRightFromLine className="size-4 opacity-70" />
              <div className="font-medium text-muted-foreground">
                Leave Game
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function DropdownTrigger({ gameId }: { gameId: string }) {
  const getLetter = () => {
    if (gameId) {
      return gameId.toUpperCase()[0];
    } else {
      return "S";
    }
  };

  const content = (
    <SidebarMenuButton className="h-12 pr-6 text-sm hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:!p-0">
      <TileIcon letter={getLetter()} />
      <div
        className={cn(
          "grid flex-1 text-left text-sm leading-tight [text-shadow:rgb(0,0,0)1px_0px_4px]",
        )}
      >
        <span className="truncate font-extrabold tracking-wider">
          {gameId ? gameId : "Skraggl.io"}
        </span>
        <span className="truncate text-xs opacity-80">
          {gameId ? "Skraggl.io" : "Play online for free!"}
        </span>
      </div>
      {gameId && <CaretSortIcon className="ml-auto" />}
    </SidebarMenuButton>
  );

  if (gameId) {
    return <DropdownMenuTrigger asChild>{content}</DropdownMenuTrigger>;
  } else {
    return content;
  }
}
