import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CrownIcon } from "lucide-react";
import { mainMenuState, RootState } from "@/state/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rtdb } from "@/app/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
export default function PlayerList() {
  const [playerData, setPlayerData] = useState<string[]>([]);
  const dispatch = useDispatch();
  const currentJoinCode = useSelector((state: RootState) => state.joinCode);
  const { toast } = useToast();

  useEffect(() => {
    const playersRef = ref(rtdb, `activeGames/${currentJoinCode.code}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPlayerData(data);
      } else {
        
        toast({
          title: "Error",
          description: "Game not available! Try creating a game.",
        });

        dispatch(
          mainMenuState.updateState({
            state: "Home",
            slideFrom: "left",
          }),
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Table>
      <TableBody>
        {Object.values(playerData).map((data, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">
              {i === 0 && <CrownIcon size={16} />}
            </TableCell>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell className="w-full">{data}</TableCell>
            <TableCell className="text-right">color</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
