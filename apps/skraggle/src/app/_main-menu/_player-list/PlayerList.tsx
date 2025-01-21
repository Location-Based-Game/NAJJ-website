import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchApi } from "@/lib/fetchApi";
import useLogOut from "@/hooks/useLogOut";
import HostIcon from "./HostIcon";
import ConnectionIcon from "./ConnectionIcon";
import selectionStyles from "@styles/selectionGradient.module.css";
import { cn } from "@/lib/tailwindUtils";
import { PlayersData } from "@types";
import { PeerStatuses } from "@/store/peerStatusSlice";

export default function PlayerList() {
  const players = useSelector((state: RootState) => state.players);
  const { playerId } = useSelector((state: RootState) => state.logIn);
  const peerStatuses = useSelector((state: RootState) => state.peerStatus);

  const { logOutOnError } = useLogOut();
  const handleChangeColor = async (color: string) => {
    try {
      await fetchApi("changePlayerColor", { color });
    } catch (error) {
      logOutOnError(error);
    }
  };

  return (
    <PlayerListView
      players={players}
      playerId={playerId}
      peerStatuses={peerStatuses}
      handleChangeColor={handleChangeColor}
    />
  );
}

interface PlayerListView {
  players: PlayersData;
  playerId: string;
  peerStatuses: PeerStatuses;
  handleChangeColor: (color: string) => Promise<void>;
}

export function PlayerListView({
  players,
  playerId,
  peerStatuses,
  handleChangeColor,
}: PlayerListView) {
  return (
    <Table>
      <TableBody>
        {Object.keys(players).map((id, i) => (
          <TableRow
            key={i}
            className={cn(
              selectionStyles.background,
              playerId === id && selectionStyles.selectionGradient,
            )}
          >
            <TableCell className="font-medium">
              <ConnectionIcon
                isMainPlayer={id === playerId}
                name={players[id].name}
                peerStatus={peerStatuses[id]}
              />
            </TableCell>
            <TableCell className="w-full">{players[id].name}</TableCell>
            <TableCell className="font-medium">
              {i === 0 && <HostIcon name={players[id].name} />}
            </TableCell>
            <PlayerColor
              playerColor={players[id].color}
              isMainPlayer={id === playerId}
              handleChangeColor={handleChangeColor}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface PlayerColor {
  playerColor: string;
  isMainPlayer: boolean;
  handleChangeColor: (color: string) => Promise<void>;
}

function PlayerColor({
  playerColor,
  isMainPlayer,
  handleChangeColor,
}: PlayerColor) {
  const [color, setColor] = useState(playerColor);

  return (
    <TableCell className="text-right">
      {isMainPlayer ? (
        <ColorPicker
          className="h-8 w-8 rounded-full"
          onChange={(color) => setColor(color as string)}
          onClose={() => handleChangeColor(color)}
          value={color}
        />
      ) : (
        <div
          className="block h-8 w-8 rounded-full shadow-sm transition-colors"
          style={{ backgroundColor: playerColor }}
        ></div>
      )}
    </TableCell>
  );
}
