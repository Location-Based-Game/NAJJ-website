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
import { PlayersData } from "../../../../functions/src/types";
import { cn } from "@/lib/tailwindUtils";

export default function PlayerList() {
  const players = useSelector((state: RootState) => state.players);
  const { playerId } = useSelector((state: RootState) => state.logIn);
  const peerStatuses = useSelector((state: RootState) => state.peerStatus);

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
              {i === 0 && <HostIcon name={players[id].name} />}
            </TableCell>
            <TableCell className="font-medium">
              <ConnectionIcon
                isMainPlayer={id === playerId}
                name={players[id].name}
                peerStatus={peerStatuses[id]}
              />
            </TableCell>
            <TableCell className="w-full">{players[id].name}</TableCell>
            <PlayerColor playerData={players} playerKey={id} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface PlayerColor {
  playerData: PlayersData;
  playerKey: string;
}

function PlayerColor({ playerData, playerKey }: PlayerColor) {
  const { playerId } = useSelector((state: RootState) => state.logIn);
  const [color, setColor] = useState(playerData[playerKey].color);
  const { logOutOnError } = useLogOut();

  return (
    <TableCell className="text-right">
      {playerId === playerKey ? (
        <ColorPicker
          className="h-8 w-8 rounded-full"
          onClose={async (value) => {
            try {
              setColor(value);
              await fetchApi("changePlayerColor", { color: value });
            } catch (error) {
              logOutOnError(error);
            }
          }}
          value={color}
        />
      ) : (
        <div
          className="block h-8 w-8 rounded-full shadow-sm transition-colors"
          style={{ backgroundColor: playerData[playerKey].color }}
        ></div>
      )}
    </TableCell>
  );
}
