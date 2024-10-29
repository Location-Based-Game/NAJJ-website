import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CrownIcon } from "lucide-react";
import { PlayersData, useGetPlayers } from "@/components/GetPlayers";
import { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchApi } from "@/lib/fetchApi";
import useLogOutOnError from "@/hooks/useLogOutOnError";

export default function PlayerList() {
  const { playerData } = useGetPlayers();

  return (
    <Table>
      <TableBody>
        {Object.keys(playerData).map((key, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">
              {i === 0 && <CrownIcon size={16} />}
            </TableCell>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell className="w-full">{playerData[key].name}</TableCell>
            <PlayerColor playerData={playerData} playerKey={key} />
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
  const { logOutOnError } = useLogOutOnError();

  return (
    <TableCell className="text-right">
      {playerId === playerKey ? (
        <ColorPicker
          className="h-8 w-8 rounded-full"
          onColorChange={(v) => {
            setColor(v);
          }}
          onClose={async () => {
            try {
              const params = new URLSearchParams({
                color,
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
