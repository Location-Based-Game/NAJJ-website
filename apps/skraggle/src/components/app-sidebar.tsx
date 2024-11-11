"use client";

import { NavMain } from "@/components/NavMain";
import { GameInfoDropdown } from "@/components/GameInfoDropdown";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { NavGameplay } from "./NavGameplay";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {isGameActive} = useSelector((state:RootState) => state.gameState)
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <GameInfoDropdown />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {isGameActive ? <NavGameplay /> : <NavMain />}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <></>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
