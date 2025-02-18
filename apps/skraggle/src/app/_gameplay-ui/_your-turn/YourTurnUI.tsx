import { createContext, useContext } from "react";
import EndTurnButton from "./EndTurnButton";
import useGetValidatedWord from "./useGetValidatedWord";
import CurrentTurnWordsList from "./CurrentTurnWordsList";
import { useGameplayUIContext } from "../GameplayUIContextProvider";
import ChallengeWordsContainer from "./ChallengeWordsContainer";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import BlankLetterInput from "./BlankLetterInput";

const ValidatedWordContext = createContext<ReturnType<
  typeof useGetValidatedWord
> | null>(null);

export default function YourTurnUI() {
  const validatedWordData = useGetValidatedWord();
  const { challengeWords } = useGameplayUIContext();
  const isMobile = useMediaQuery(1024);

  return (
    <ValidatedWordContext.Provider value={validatedWordData}>
      <AnimatePresence mode="wait">
        {Object.keys(challengeWords).length === 0 ? (
          <motion.div
            exit={{ opacity: 0, y: 20 }}
            key={0}
            className="static flex h-full w-full items-center justify-center"
          >
            {!isMobile && <CurrentTurnWordsList />}
            <EndTurnButton ref={validatedWordData.scopeLabel} />
            <BlankLetterInput />
          </motion.div>
        ) : (
          <ChallengeWordsContainer />
        )}
      </AnimatePresence>
    </ValidatedWordContext.Provider>
  );
}

export function useValidatedWordContext() {
  const validatedWordData = useContext(ValidatedWordContext);
  if (validatedWordData === null) {
    throw new Error(
      "useValidatedWordContext must be used within a ValidatedWordContext Provider",
    );
  }

  return validatedWordData;
}
