"use client";
import { cn } from "@/lib/tailwindUtils";
import panelStyles from "@styles/panel.module.css";
import { JoinCodeView } from "@/app/_main-menu/_create-game/JoinCode";

export default function PlayerListFixture() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div
        className={cn("relative", panelStyles.woodBorder)}
        style={{ width: "30rem", padding: "2rem" }}
      >
        <div className={panelStyles.woodBackground}></div>
        <JoinCodeView gameId="AAAA"/>
      </div>
    </div>
  );
}

