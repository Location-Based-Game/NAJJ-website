import PlayerData from "@/components/GetPlayers";
import GameUI from "./_gameplay-ui/GameUI";
import UnityContextProvider from "./_unity-player/UnityContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import GameHeader from "./_header/GameHeader";

export default function Home() {
  return (
    <SidebarProvider>
      <PlayerData>
        <UnityContextProvider>
          <AppSidebar className="pointer-events-auto" />
          <SidebarInset>
            <GameHeader />
            <GameUI />
          </SidebarInset>
        </UnityContextProvider>
      </PlayerData>
    </SidebarProvider>
  );
}
