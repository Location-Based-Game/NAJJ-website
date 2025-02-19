"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import ConnectionIcon from "../_main-menu/_player-list/ConnectionIcon";
import selectionStyles from "@styles/selectionGradient.module.css";
import { cn } from "@/lib/tailwindUtils";
import { PlayersData } from "@types";
import { PeerStatuses } from "@/store/peerStatusSlice";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import sidebarStyles from "./playerSidebar.module.css";
import backgroundStyles from "@styles/main.module.css";
import Noise from "@/components/Noise";
import dynamic from "next/dynamic";

const SidebarAd = dynamic(() => import("./SidebarAd"), { ssr: false });

export default function PlayerSidebar() {
  const players = useSelector((state: RootState) => state.players);
  const { currentTurn } = useSelector((state: RootState) => state.turnState);
  const peerStatuses = useSelector((state: RootState) => state.peerStatus);
  const { playerId } = useSelector((state: RootState) => state.logIn);

  return (
    <PlayerSidebarView
      players={players}
      currentTurn={currentTurn}
      peerStatuses={peerStatuses}
      playerId={playerId}
    />
  );
}

interface PlayerSideBarView {
  players: PlayersData;
  currentTurn: number;
  peerStatuses: PeerStatuses;
  playerId: string;
}

export function PlayerSidebarView({
  players,
  currentTurn,
  peerStatuses,
  playerId,
}: PlayerSideBarView) {
  const isMobile = useMediaQuery(1024);

  const playerList = Object.entries(players).map(([id, data], index) => {
    return (
      <div
        key={index}
        className={cn(
          "relative flex h-10 w-full items-center justify-end gap-2 overflow-hidden rounded-lg border-[1px] border-black/20 bg-black/30 px-4 text-lg",
          currentTurn === data.turn && selectionStyles.selectionGradient2,
        )}
      >
        <div className="grow font-semibold text-[#ffc56d]">{data.points}</div>
        {data.name}
        <ConnectionIcon
          isMainPlayer={id === playerId}
          name={data.name}
          peerStatus={peerStatuses[id]}
        />
      </div>
    );
  });

  return isMobile ? (
    <Sheet>
      {playerId && (
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="fixed right-3 top-[6px] flex h-fit items-center gap-2 px-2 py-1 text-white transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="text-sm font-light opacity-70">Players</span>
            <Users size={20} />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="right"
        className={cn(
          sidebarStyles.playerSidebarBorder,
          backgroundStyles.mainBackground,
          "w-[16rem] border-none text-white",
        )}
      >
        <Noise />
        <SheetHeader>
          <SheetTitle className="mb-4 mt-[-1rem] text-left text-white">
            Players
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col justify-between gap-1">
          <div>{playerList}</div>
          <SidebarAd />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <div className="min-w-[14rem]">
      <div className="flex h-full w-full flex-col justify-between gap-1 pl-4 pr-3 pt-12 text-white">
        <div>{playerList}</div>
        <SidebarAd />
      </div>
    </div>
  );
}
