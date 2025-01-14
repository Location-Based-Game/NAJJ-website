"use client";
import { SidebarNavMain } from "@/components/sidebar/SidebarNavMain";
import {
  SidebarContent,
  SidebarGroup,
  SidebarProvider,
  useSidebar,
} from "@/components/sidebar/sidebar";
import SidebarBase from "@/components/sidebar/SidebarBase";
import SidebarRail from "@/components/sidebar/SidebarRail";
import { Button } from "@/components/ui/button";

export default () => {
  return (
    <SidebarProvider>
      <SidebarBase collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarNavMain />
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </SidebarBase>
      <Toggle />
    </SidebarProvider>
  );
};

function Toggle() {
  const { toggleSidebar } = useSidebar();

  return <Button onClick={() => toggleSidebar()}>Toggle Sidebar</Button>;
}
