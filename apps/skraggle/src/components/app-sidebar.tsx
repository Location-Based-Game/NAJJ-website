"use client"

import { NavMain } from "@/components/NavMain"
import { GameInfoDropdown } from "@/components/GameInfoDropdown"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <GameInfoDropdown />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <></>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
