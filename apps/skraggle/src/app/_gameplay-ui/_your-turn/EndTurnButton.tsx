import { Button } from "@/components/ui/button";
import { ref, runTransaction } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
export default function EndTurnButton() {
  const [enableButton, setEnableButton] = useState(true);
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const handleEndTurn = async () => {
    const turnRef = ref(rtdb, `activeGames/${gameId}/currentTurn`);
    await runTransaction(turnRef, (currentValue:number) => {
      if (currentValue === null) {
        return 1;
      }
      return currentValue + 1;
    })
  };

  return (
    <Button
      onClick={() => {
        handleEndTurn();
        setEnableButton(false);
      }}
      disabled={!enableButton}
      className="absolute top-4"
    >
      End Turn
    </Button>
  );
}
