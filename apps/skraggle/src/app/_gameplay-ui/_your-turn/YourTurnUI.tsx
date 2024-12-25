import { createContext, useContext } from "react";
import EndTurnButton from "./EndTurnButton";
import useGetValidatedWord from "./useGetValidatedWord";
import CurrentTurnWordsList from "./CurrentTurnWordsList";

const ValidatedWordContext = createContext<ReturnType<
  typeof useGetValidatedWord
> | null>(null);

export default function YourTurnUI() {
  const validatedWordData = useGetValidatedWord();

  return (
    <ValidatedWordContext.Provider value={validatedWordData}>
      <CurrentTurnWordsList />
      <EndTurnButton ref={validatedWordData.scopeLabel} />
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
