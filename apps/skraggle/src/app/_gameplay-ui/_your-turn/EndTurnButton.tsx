import { Button } from "@/components/ui/button";
import React, { forwardRef, HTMLAttributes, useContext } from "react";
import { motion, MotionProps } from "framer-motion";
import { GamePlayUIContext } from "../GameUI";
import { fetchApi } from "@/lib/fetchApi";
import { useValidatedWordContext } from "./YourTurnUI";

const MotionButton = motion.create(Button);

type EndTurnButton = HTMLAttributes<HTMLButtonElement> & MotionProps;

const EndTurnButton = forwardRef<HTMLSpanElement, EndTurnButton>(({}, ref) => {
  const showUI = useContext(GamePlayUIContext);
  const { setEnableButton, enableButton, buttonLabel } =
    useValidatedWordContext();
    
  const handleEndTurn = async () => {
    await fetchApi("endTurn");
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
        layout
        transition={{ layout: { duration: 0.2 } }}
        className="absolute top-4 overflow-hidden disabled:bg-gray-500 disabled:opacity-100"
        disabled={!enableButton || buttonLabel != "End Turn"}
      >
        <span ref={ref}>{buttonLabel}</span>
      </MotionButton>
    )
  );
});

EndTurnButton.displayName = "EndTurnButton";

export default EndTurnButton;
