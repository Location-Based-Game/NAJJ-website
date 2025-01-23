import { motion } from "framer-motion";
import ChallengeWordsList from "../_challenge-words/ChallengeWordsList";
import { fetchApi } from "@/lib/fetchApi";
import useLogOut from "@/hooks/useLogOut";
import { useGameplayUIContext } from "../GameplayUIContextProvider";
import { useEffect, useRef } from "react";

export default function ChallengeWordsContainer() {
  const { getCurrentItems } = useGameplayUIContext();
  const { logOutOnError } = useLogOut();
  const handleChallengeTimeout = async () => {
    const { currentItems } = await getCurrentItems();
    await fetchApi("endTurnGetNewLetters", { currentItems }).catch((error) => {
      logOutOnError(error);
    });
  };

  const timerRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleChallengeTimeout();
    }, 12000);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="absolute top-4 flex flex-col items-center gap-2"
    >
      <div className="relative overflow-hidden rounded-md bg-secondary px-3 py-2 text-secondary-foreground">
        <motion.div
          className="absolute bottom-0 right-0 h-full w-full origin-left bg-[#d4d4d4]"
          animate={{ scaleX: 0 }}
          transition={{ duration: 12, ease: "linear" }}
        />
        <span className="animate-pulse text-gray-600">
          Waiting for challengers
        </span>
      </div>
      <ChallengeWordsList showChallengeButton={false} />
    </motion.div>
  );
}
