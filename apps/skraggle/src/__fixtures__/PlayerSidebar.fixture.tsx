"use client";
import { PlayerSidebarView } from "@/app/_player-sidebar/PlayerSidebar";
import { cn } from "@/lib/tailwindUtils";
import { PeerStatuses } from "@/store/peerStatusSlice";
import { PlayersData } from "@types";
import { useFixtureInput } from "react-cosmos/client";
import styles from "@styles/main.module.css";
import Noise from "@/components/Noise";

export default () => {
  const [currentTurn] = useFixtureInput("Current Turn", 0);
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
    <div className={cn(styles.mainBackground, "h-dvh w-full")}>
      <Noise />
      <PlayerSidebarView
        players={players}
        currentTurn={currentTurn}
        peerStatuses={peerStatuses}
        playerId="TestPlayer"
      />
    </div>
  );
};
