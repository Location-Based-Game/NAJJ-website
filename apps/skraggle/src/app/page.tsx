import GameUI from "./_gameplay-ui/GameUI";
import UnityContextProvider from "./_unity-player/UnityContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import GameHeader from "./_header/GameHeader";
import LeaveGameProvider from "./LeaveGameProvider";

export default function Home() {
  return (
    <SidebarProvider>
      <UnityContextProvider>
        <LeaveGameProvider>
          <AppSidebar className="pointer-events-auto" />
          <SidebarInset>
            <GameHeader />
            <GameUI />
          </SidebarInset>
        </LeaveGameProvider>
      </UnityContextProvider>
    </SidebarProvider>
  );
}
