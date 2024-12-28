import { createContext, useContext } from "react";
import EndTurnButton from "./EndTurnButton";
import useGetValidatedWord from "./useGetValidatedWord";
import CurrentTurnWordsList from "./CurrentTurnWordsList";
import { useGameplayUIContext } from "../GameplayUIContextProvider";
import ChallengeWords from "./ChallengeWords";

const ValidatedWordContext = createContext<ReturnType<
  typeof useGetValidatedWord
> | null>(null);

export default function YourTurnUI() {
  const validatedWordData = useGetValidatedWord();
  const { challengeWords } = useGameplayUIContext();

  return (
    <ValidatedWordContext.Provider value={validatedWordData}>
      {Object.keys(challengeWords).length === 0 ? (
        <>
          <CurrentTurnWordsList />
          <EndTurnButton ref={validatedWordData.scopeLabel} />
        </>
      ) : (
        <ChallengeWords />
      )}
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
