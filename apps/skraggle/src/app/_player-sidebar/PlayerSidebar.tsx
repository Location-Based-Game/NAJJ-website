"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import ConnectionIcon from "../_main-menu/_player-list/ConnectionIcon";
import selectionStyles from "@styles/selectionGradient.module.css";
import { cn } from "@/lib/tailwindUtils";

export default function PlayerSidebar() {
  const players = useSelector((state: RootState) => state.players);
    const {currentTurn} = useSelector((state: RootState) => state.turnState);
  return (
    <div className="w-[14rem]">
      <div className="flex w-full flex-col gap-1 pl-4 pr-3 pt-12 text-white">
        {Object.entries(players).map(([id, data], index) => {
          return (
            <div
              key={index}
              className={cn(
                "relative flex h-10 w-full border-[1px] border-black/20 items-center overflow-hidden justify-end gap-2 rounded-lg bg-black/30 px-4 text-lg",
                currentTurn === data.turn && selectionStyles.selectionGradient2,
              )}
            >
              <div className="grow font-semibold text-[#ffc56d]">
                {data.points}
              </div>
              {data.name}
              <ConnectionIcon peerId={id} name={data.name} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
