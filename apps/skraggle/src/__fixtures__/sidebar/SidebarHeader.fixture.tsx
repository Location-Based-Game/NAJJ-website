"use client";
import {
  SidebarHeader,
  SidebarProvider,
  useSidebar,
} from "@/components/sidebar/sidebar";
import SidebarBase from "@/components/sidebar/SidebarBase";
import SidebarRail from "@/components/sidebar/SidebarRail";
import { Button } from "@/components/ui/button";
import { GameInfoDropdownView } from "@/components/sidebar/GameInfoDropdown";
import { useState } from "react";
import { useFixtureInput } from "react-cosmos/client";

export default () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isGameplay] = useFixtureInput("isGamePlay", false);

  return (
    <SidebarProvider>
      <SidebarBase collapsible="icon">
        <SidebarHeader>
          <GameInfoDropdownView
            isDropdownOpen={isDropdownOpen}
            setDropdownOpen={setDropdownOpen}
            gameId={isGameplay ? "asdf" : ""}
            onDropdownSelect={(_: Event) => {}}
          />
        </SidebarHeader>
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
