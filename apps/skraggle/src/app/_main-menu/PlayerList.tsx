import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CrownIcon } from "lucide-react";
import { useGetPlayers } from "@/components/GetPlayers";

export default function PlayerList() {
  const { playerData } = useGetPlayers();

  return (
    <Table>
      <TableBody>
        {Object.values(playerData).map((data, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">
              {i === 0 && <CrownIcon size={16} />}
            </TableCell>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell className="w-full">{data.name}</TableCell>
            <TableCell className="text-right">color</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
