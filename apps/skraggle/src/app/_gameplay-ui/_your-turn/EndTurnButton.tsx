import { Button } from "@/components/ui/button";
import { ref, runTransaction } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import { motion } from "framer-motion";

const MotionButton = motion.create(Button);

export default function EndTurnButton() {
  const [enableButton, setEnableButton] = useState(true);
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const players = useSelector((state: RootState) => state.players);

  const handleEndTurn = async () => {
    const turnRef = ref(rtdb, `activeGames/${gameId}/currentTurn`);
    await runTransaction(turnRef, (currentValue: number) => {
      const playerAmount = Object.keys(players).length;
      if (currentValue === null || playerAmount === 1) return currentValue;
      return (currentValue + 1) % playerAmount;
    });
  };

  return (
    <MotionButton
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => {
        handleEndTurn();
        setEnableButton(false);
      }}
      disabled={!enableButton}
      className="absolute top-4"
    >
      End Turn
    </MotionButton>
  );
}
