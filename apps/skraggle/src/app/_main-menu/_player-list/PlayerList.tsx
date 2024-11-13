import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchApi } from "@/lib/fetchApi";
import useLogOut from "@/hooks/useLogOut";
import HostIcon from "./HostIcon";
import ConnectionIcon from "./ConnectionIcon";
import styles from "./selectionGradient.module.css"
import { PlayersData } from "@/store/playersSlice";

export default function PlayerList() {
  const players = useSelector((state: RootState) => state.players);
  const { playerId } = useSelector((state: RootState) => state.logIn);

  return (
    <Table>
      <TableBody>
        {Object.keys(players).map((key, i) => (
          <TableRow
            key={i}
            className={playerId === key ? styles.selectionGradient : ""}
          >
            <TableCell className="font-medium">
              {i === 0 && <HostIcon name={players[key].name} />}
            </TableCell>
            <TableCell className="font-medium">
              <ConnectionIcon peerId={key} name={players[key].name} />
            </TableCell>
            <TableCell className="w-full">{players[key].name}</TableCell>
            <PlayerColor playerData={players} playerKey={key} />
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
              const params = new URLSearchParams({
                color: value
              }).toString();
              await fetchApi(`/api/change-player-color?${params}`);
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
