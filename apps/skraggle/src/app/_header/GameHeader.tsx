"use client";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/sidebar/sidebar";
import MainMenuBreadCrumb from "./MainMenuBreadCrumb";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import GameplayBreadCrumb from "./GameplayBreadCrumb";

export default function GameHeader() {
  const { isGameActive } = useSelector((state: RootState) => state.gameState);

  return (
    <header className="pointer-events-auto flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          {isGameActive ? <GameplayBreadCrumb /> : <MainMenuBreadCrumb />}
        </Breadcrumb>
      </div>
    </header>
  );
}
