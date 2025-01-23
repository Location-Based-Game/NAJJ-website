import { AnimatePresence, motion } from "framer-motion";
import ChallengeWordsList from "../_challenge-words/ChallengeWordsList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";

export default function ChallengeWordsContainer() {
  const players = useSelector((state: RootState) => state.players);
  const { currentTurn, firstTurnPassed } = useSelector(
    (state: RootState) => state.turnState,
  );
  const getCurrentPlayer = useMemo(() => {
    const currentPlayer = Object.values(players).filter(
      (data) => data.turn === currentTurn,
    )[0];

    if (!currentPlayer) return "";
    return currentPlayer.name;
  }, [players, currentTurn]);
  const [showChallengeWords, setShowChallengeWords] = useState(true);

  useEffect(() => {
    // Hide challenge words when player joins/rejoins the game
    setShowChallengeWords(firstTurnPassed);
  }, [firstTurnPassed]);

  return (
    <AnimatePresence>
      {showChallengeWords && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 flex flex-col items-center gap-2"
        >
          <div className="relative overflow-hidden rounded-md bg-secondary px-3 py-2 text-secondary-foreground">
            <motion.div
              className="absolute bottom-0 right-0 h-full w-full origin-left bg-[#d4d4d4]"
              animate={{ scaleX: 0 }}
              transition={{ duration: 10, ease: "linear" }}
              onAnimationComplete={() => {
                // To avoid latency errors, challenging players have a 10 second countdown
                // whereas the actual countdown is 12 seconds. This prevents players from
                // wagering at the last second.
                setShowChallengeWords(false);
              }}
            />
            <span className="animate-pulse text-gray-600">
              Challenge <strong>{getCurrentPlayer}</strong>?
            </span>
          </div>
          <ChallengeWordsList showChallengeButton />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
