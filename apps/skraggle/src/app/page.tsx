import Viewport from "./Viewport";
import UnityContextProvider from "./_unity-player/UnityContext";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/sidebar/sidebar";
import GameHeader from "./_header/GameHeader";
import LeaveGameProvider from "./LeaveGameProvider";
import styles from "@styles/main.module.css";
import { cn } from "@/lib/tailwindUtils";
import PlayerSidebar from "./_player-sidebar/PlayerSidebar";
import Noise from "@/components/Noise";

export default function Home() {
  return (
    <UnityContextProvider>
      <SidebarProvider>
        <LeaveGameProvider>
          <AppSidebar className="pointer-events-auto" />
          <Main />
        </LeaveGameProvider>
      </SidebarProvider>
    </UnityContextProvider>
  );
}

function Main() {
  return (
    <main className={cn(styles.mainBackground, "relative flex h-dvh flex-1")}>
      <Noise />
      <div className="grow flex flex-col">
        <GameHeader />
        <Viewport className={styles.viewPort} />
      </div>
      <PlayerSidebar />
    </main>
  );
}
