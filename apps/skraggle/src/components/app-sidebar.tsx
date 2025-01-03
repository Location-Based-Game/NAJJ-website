"use client";

import { SidebarNavMain } from "@/components/SidebarNavMain";
import { GameInfoDropdown } from "@/components/ui/sidebar/GameInfoDropdown";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { SidebarNavGameplay } from "./SidebarNavGameplay";
import SidebarRail from "./ui/sidebar/SidebarRail";
import SidebarBase from "./ui/sidebar/SidebarBase";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof SidebarBase>) {
  const { isGameActive } = useSelector((state: RootState) => state.gameState);

  return (
    <SidebarBase collapsible="icon" {...props}>
      <SidebarHeader>
        <GameInfoDropdown />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {isGameActive ? <SidebarNavGameplay /> : <SidebarNavMain />}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <></>
      </SidebarFooter>
      <SidebarRail />
    </SidebarBase>
  );
}
