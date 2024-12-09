import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { GamePlayUIContext } from "../GameUI";
import { fetchApi } from "@/lib/fetchApi";

const MotionButton = motion.create(Button);

export default function EndTurnButton() {
  const [enableButton, setEnableButton] = useState(true);
  const showUI = useContext(GamePlayUIContext);

  const handleEndTurn = async () => {
    await fetchApi("endTurn")
  };

  return (
    showUI && (
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
    )
  );
}
