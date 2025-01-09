import Viewport from "./Viewport";
import UnityContextProvider from "./_unity-player/UnityContext";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/sidebar/sidebar";
import GameHeader from "./_header/GameHeader";
import LeaveGameProvider from "./LeaveGameProvider";
import styles from "@styles/main.module.css";
import { cn } from "@/lib/tailwindUtils";

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
    <main
      className={cn(
        styles.mainBackground,
        "relative flex h-dvh flex-1 bg-[#2A2A3C]",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute h-full w-full mix-blend-multiply"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>

        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      <div className="grow">
        <GameHeader />
        <Viewport className={styles.viewPort} />
      </div>
      <div className="w-[14rem]"></div>
    </main>
  );
}
