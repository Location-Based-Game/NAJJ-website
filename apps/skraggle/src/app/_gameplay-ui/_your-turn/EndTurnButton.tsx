import { Button } from "@/components/ui/button";
import React, { forwardRef, HTMLAttributes, useContext } from "react";
import { motion, MotionProps } from "framer-motion";
import { fetchApi } from "@/lib/fetchApi";
import { useValidatedWordContext } from "./YourTurnUI";
import { SubmittedWordType } from "@schemas/wordDataSchema";
import { useGameplayUIContext } from "../GameplayUIContextProvider";

const MotionButton = motion.create(Button);

type EndTurnButton = HTMLAttributes<HTMLButtonElement> & MotionProps;

const EndTurnButton = forwardRef<HTMLSpanElement, EndTurnButton>(({}, ref) => {
  const { showGameplayUI } = useGameplayUIContext();
  const { setEnableButton, enableButton, buttonLabel, wordsData } =
    useValidatedWordContext();

  const handleEndTurn = async () => {
    const data: SubmittedWordType = {
      wordsData,
    };
    await fetchApi("endTurn");
  };

  return (
    showGameplayUI && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4"
      >
        <MotionButton
          onClick={() => {
            handleEndTurn();
            setEnableButton(false);
          }}
          layout
          transition={{ layout: { duration: 0.2 } }}
          className="overflow-hidden disabled:bg-gray-500 disabled:opacity-100"
          disabled={!enableButton || buttonLabel != "End Turn"}
        >
          <span ref={ref}>{buttonLabel}</span>
        </MotionButton>
      </motion.div>
    )
  );
});

EndTurnButton.displayName = "EndTurnButton";

export default EndTurnButton;
