import { Button } from "@/components/ui/button";
import React, { forwardRef, HTMLAttributes } from "react";
import { motion, MotionProps } from "framer-motion";
import { fetchApi } from "@/lib/fetchApi";
import { useValidatedWordContext } from "./YourTurnUI";
import { useGameplayUIContext } from "../GameplayUIContextProvider";
import useSetInventories from "../useSetInventories";
import useLogOut from "@/hooks/useLogOut";
import { SubmittedChallengeWords } from "@schemas/challengeWordSchema";

const MotionButton = motion.create(Button);

type EndTurnButton = HTMLAttributes<HTMLButtonElement> & MotionProps;

const EndTurnButton = forwardRef<HTMLSpanElement, EndTurnButton>(({}, ref) => {
  const { showGameplayUI, getCurrentItems } = useGameplayUIContext();
  const { setEnableButton, enableButton, buttonLabel, wordsData } =
    useValidatedWordContext();
  const { logOutOnError } = useLogOut();

  const handleEndTurn = async () => {
    const { currentItems } = await getCurrentItems();
    const data: SubmittedChallengeWords = {
      submittedChallengeWords: wordsData,
      currentItems,
    };
    await fetchApi("submitChallengeWords", data).catch((error) => {
      logOutOnError(error);
    });
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
