import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { GamePlayUIContext } from "../GameUI";
import { fetchApi } from "@/lib/fetchApi";

export default function EndTurnButton() {
  const [enableButton, setEnableButton] = useState(true);
  const showUI = useContext(GamePlayUIContext);

  const handleEndTurn = async () => {
    await fetchApi("endTurn");
  };

  return (
    showUI && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4"
      >
        <Button
          onClick={() => {
            handleEndTurn();
            setEnableButton(false);
          }}
          disabled={!enableButton}
        >
          End Turn
        </Button>
      </motion.div>
    )
  );
}
