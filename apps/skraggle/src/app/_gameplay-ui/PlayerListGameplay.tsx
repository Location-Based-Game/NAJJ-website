import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import ConnectionIcon from "../_main-menu/_player-list/ConnectionIcon";

export default function PlayerListGameplay() {
  const players = useSelector((state: RootState) => state.players);

  return (
    <div className="absolute pointer-events-auto right-0 text-white flex flex-col gap-4">
      {Object.entries(players).map(([id, data], index) => {
        return (
          <div key={index} className="mr-8 gap-2 px-4 rounded-lg h-10 w-[8rem] flex justify-end items-center bg-gradient-to-l from-black/50">
            {data.name}
            <ConnectionIcon peerId={id} name={data.name} />
          </div>
        );
      })}
    </div>
  );
}
