"use client";

import Rejoining from "@/app/_main-menu/_rejoin/Rejoining";
import { cn } from "@/lib/tailwindUtils";
import panelStyles from "@styles/panel.module.css";

export default function RejoiningFixture() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div
        className={cn("relative flex justify-center items-center", panelStyles.woodBorder)}
        style={{ width: "24rem", padding: "3rem" }}
      >
        <div className={panelStyles.woodBackground}></div>
        <Rejoining />
      </div>
    </div>
  );
}
