"use client";

import { PlayerListView } from "@/app/_main-menu/_player-list/PlayerList";
import { cn } from "@/lib/tailwindUtils";
import { PeerStatuses } from "@/store/peerStatusSlice";
import { PlayersData } from "@types";
import panelStyles from "@styles/panel.module.css";

export default function PlayerListFixture() {
  const players: PlayersData = {
    TestPlayer1: {
      name: "TestPlayer1",
      color: "#85c4ff",
      turn: 0,
      isOnline: true,
      points: 0,
    },
    TestPlayer2: {
      name: "TestPlayer2",
      color: "#eb85ff",
      turn: 0,
      isOnline: true,
      points: 0,
    },
    TestPlayer3: {
      name: "TestPlayer3",
      color: "#85ffa0",
      turn: 0,
      isOnline: true,
      points: 0,
    },
    TestPlayer4: {
      name: "TestPlayer4",
      color: "#ffed85",
      turn: 0,
      isOnline: true,
      points: 0,
    },
  };

  const peerStatuses: PeerStatuses = {
    TestPlayer1: "connected",
    TestPlayer2: "pending",
    TestPlayer3: "error",
    TestPlayer4: "not connected",
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div
        className={cn("relative", panelStyles.woodBorder)}
        style={{ width: "30rem", padding: "2rem" }}
      >
        <div className={panelStyles.woodBackground}></div>
        <PlayerListView
          playerId="TestPlayer1"
          players={players}
          peerStatuses={peerStatuses}
          handleChangeColor={async () => {}}
        />
      </div>
    </div>
  );
}

