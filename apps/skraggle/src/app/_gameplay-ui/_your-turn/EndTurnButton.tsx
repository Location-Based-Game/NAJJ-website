import { Button } from "@/components/ui/button";
import React, { forwardRef, HTMLAttributes } from "react";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { fetchApi } from "@/lib/fetchApi";
import { useValidatedWordContext } from "./YourTurnUI";
import { useGameplayUIContext } from "../GameplayUIContextProvider";
import useLogOut from "@/hooks/useLogOut";
import {
  ChallengeWordsRecord,
  SubmittedChallengeWords,
} from "@schemas/challengerSchema";
import WordItem from "./WordItem";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const MotionButton = motion.create(Button);

type EndTurnButton = HTMLAttributes<HTMLButtonElement> & MotionProps;

const EndTurnButton = forwardRef<HTMLSpanElement, EndTurnButton>(({}, ref) => {
  const { showGameplayUI, getCurrentItems } = useGameplayUIContext();
  const { setEnableButton, enableButton, buttonLabel, wordsData } =
    useValidatedWordContext();
  const { logOutOnError } = useLogOut();
  const isMobile = useMediaQuery(1024);
  const players = useSelector((state: RootState) => state.players);

  const handleEndTurn = async () => {
    const { currentItems } = await getCurrentItems();
    const challengeWordsData: SubmittedChallengeWords = {
      submittedChallengeWords: wordsData as ChallengeWordsRecord,
      currentItems,
    };

    await fetchApi("submitChallengeWords", challengeWordsData).catch(
      (error) => {
        logOutOnError(error);
      },
    );
  };

  return (
    showGameplayUI && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 flex flex-col items-center gap-2"
      >
        <MotionButton
          onClick={() => {
            handleEndTurn();
            setEnableButton(false);
          }}
          layout
          transition={{ layout: { duration: 0.2 } }}
          className="overflow-hidden transition-colors disabled:bg-gray-500 disabled:opacity-100"
          disabled={
            !enableButton ||
            buttonLabel != "End Turn" ||
            Object.keys(players).length === 0 ||
            Object.keys(players).length === 1
          }
        >
          <span ref={ref}>{buttonLabel}</span>
        </MotionButton>
        {isMobile && (
          <AnimatePresence>
            {Object.values(wordsData).map((data, i) => {
              return <WordItem key={i} wordData={data} showBonusPoints />;
            })}
          </AnimatePresence>
        )}
      </motion.div>
    )
  );
});

EndTurnButton.displayName = "EndTurnButton";

export default EndTurnButton;
