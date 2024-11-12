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
} from "@/components/ui/sidebar";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ArrowRightFromLine } from "lucide-react";
import styles from "./GameInfoDropdown.module.css";
import useLogOut from "@/hooks/useLogOut";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { useState } from "react";
import { useLeaveGame } from "@/app/LeaveGameProvider";

export function GameInfoDropdown() {
  const { leaveGame } = useLogOut();
  const { callUnityFunction } = useUnityReactContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { setOpenDialogue, onLeave } = useLeaveGame();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownTrigger />
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuItem
              className="gap-4 p-2"
              onSelect={(e) => {
                e.preventDefault();
                onLeave.current = async () => {
                  setDropdownOpen(false);
                  await leaveGame("Home");
                  callUnityFunction("ResetGame");
                }
                setOpenDialogue(true);
              }}
            >
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

function DropdownTrigger() {
  const { gameId } = useSelector((state: RootState) => state.logIn);

  const handleIcon = () => {
    if (gameId) {
      return gameId.toUpperCase()[0];
    } else {
      return "S";
    }
  };

  const content = (
    <>
      <div className={styles.tileIcon}>
        <span className="z-[2] text-lg font-black text-black">
          {handleIcon()}
        </span>
        <span className="absolute translate-x-[-1px] translate-y-[-1px] text-lg font-black text-gray-200">
          {handleIcon()}
        </span>
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-extrabold tracking-wider">
          {gameId ? gameId : "Skraggle"}
        </span>
        <span className="truncate text-xs opacity-60">
          {gameId ? "Party Mode" : "Play online for free!"}
        </span>
      </div>
      {gameId && <CaretSortIcon className="ml-auto" />}
    </>
  );

  if (gameId) {
    return (
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {content}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
    );
  } else {
    return (
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        {content}
      </SidebarMenuButton>
    );
  }
}
