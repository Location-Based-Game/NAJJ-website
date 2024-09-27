import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import usePanelTransition from "@/hooks/usePanelTransition";
import { RootState, mainMenuState } from "@/state/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainMenuState } from "../MainMenuPanel";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { rtdb } from "@/app/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { CrownIcon } from "lucide-react";

export default function JoinGame() {
  const dispatch = useDispatch();
  const guestName = useSelector((state: RootState) => state.guestName);

  const [enableButtons, setEnableButtons] = useState(true);
  const [playerData, setPlayerData] = useState<string[]>([]);

  useEffect(() => {
    const playersRef = ref(rtdb, `activeGames/jr2p/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPlayerData(data);
      } else {
        dispatch(mainMenuState.updateState("main"));
      }
    });

    return () => unsubscribe();

  }, []);

  const { scope, handleAnimation } = usePanelTransition(
    (state: MainMenuState) => {
      dispatch(mainMenuState.updateState(state));
    },
  );

  return (
    <InnerPanelWrapper ref={scope}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="h-12 w-full">
            Leave Game
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Game?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be removed from this room.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleAnimation("sign in join");
              }}
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="w-full grow">
        <h2 className="my-6 w-full text-center">Players</h2>
        <Table>
          <TableBody>
            {Object.values(playerData).map((data, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  {i === 0 && <CrownIcon size={16} />}
                </TableCell>
                <TableCell className="font-medium">{i + 1}</TableCell>
                <TableCell>{data}</TableCell>
                <TableCell className="text-right">color</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        disabled={!enableButtons}
        className="h-12 w-full"
        onClick={() => {
          handleAnimation("create game");
          setEnableButtons(false);
        }}
      >
        Ready!
      </Button>
    </InnerPanelWrapper>
  );
}
