"use client";

import { PlayerListView } from "@/app/_main-menu/_player-list/PlayerList";
import { cn } from "@/lib/tailwindUtils";
import { PeerStatuses } from "@/store/peerStatusSlice";
import { PlayersData } from "@types";
import panelStyles from "@styles/panel.module.css";

export default function PlayerListFixture() {
  const players: PlayersData = {
    TestPlayer: {
      name: "TestPlayer",
      color: "#fff",
      turn: 0,
      isOnline: true,
      points: 0,
    },
  };

  const peerStatuses: PeerStatuses = {
    TestPlayer: "connected",
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div
        className={cn("relative", panelStyles.woodBorder)}
        style={{ width: "30rem" }}
      >
        <div className={panelStyles.woodBackground}></div>
        <PlayerListView
          playerId="TestPlayer"
          players={players}
          peerStatuses={peerStatuses}
          handleChangeColor={async () => {}}
        />
      </div>
    </div>
  );
};
