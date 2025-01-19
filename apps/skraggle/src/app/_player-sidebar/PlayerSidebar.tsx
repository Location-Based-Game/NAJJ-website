"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import ConnectionIcon from "../_main-menu/_player-list/ConnectionIcon";
import selectionStyles from "@styles/selectionGradient.module.css";
import { cn } from "@/lib/tailwindUtils";
import { PlayersData } from "@types";
import { PeerStatuses } from "@/store/peerStatusSlice";

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
  return (
    <div className="w-[14rem]">
      <div className="flex w-full flex-col gap-1 pl-4 pr-3 pt-12 text-white">
        {Object.entries(players).map(([id, data], index) => {
          return (
            <div
              key={index}
              className={cn(
                "relative flex h-10 w-full items-center justify-end gap-2 overflow-hidden rounded-lg border-[1px] border-black/20 bg-black/30 px-4 text-lg",
                currentTurn === data.turn && selectionStyles.selectionGradient2,
              )}
            >
              <div className="grow font-semibold text-[#ffc56d]">
                {data.points}
              </div>
              {data.name}
              <ConnectionIcon
                isMainPlayer={id === playerId}
                name={data.name}
                peerStatus={peerStatuses[id]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
