import { RootState } from "@/store/store";
import React, {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { ChallengeWordsRecord } from "@schemas/challengeWordSchema";
import useSetInventories from "./useSetInventories";
import { CurrentItemsType } from "@schemas/currentItemsSchema";

export const GamePlayUIContext = createContext<{
  showGameplayUI: boolean;
  challengeWords: ChallengeWordsRecord;
  setChallengeWords: React.Dispatch<React.SetStateAction<ChallengeWordsRecord>>;
  getCurrentItems: () => Promise<CurrentItemsType>
} | null>(null);

export default function GameplayUIContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showGameplayUI, setShowGameplayUI] = useState(false);
  const [challengeWords, setChallengeWords] = useState<ChallengeWordsRecord>(
    {},
  );

  const handleShowGamePlayUI = useCallback(() => {
    setShowGameplayUI(true);
  }, []);
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const { addEventListener, removeEventListener } = useUnityReactContext();
  const { getCurrentItems } = useSetInventories();

  useEffect(() => {
    if (!isGameActive) {
      setShowGameplayUI(false);
    }
    addEventListener("ShowGamePlayUI", handleShowGamePlayUI);

    return () => {
      removeEventListener("ShowGamePlayUI", handleShowGamePlayUI);
    };
  }, [
    addEventListener,
    removeEventListener,
    handleShowGamePlayUI,
    isGameActive,
  ]);

  return (
    <GamePlayUIContext.Provider
      value={{ showGameplayUI, challengeWords, setChallengeWords, getCurrentItems }}
    >
      {children}
    </GamePlayUIContext.Provider>
  );
}

export function useGameplayUIContext() {
  const context = useContext(GamePlayUIContext);
  if (!context) {
    throw new Error(
      "useGameplayUIContext must be used within a GamePlayUIContextProvider",
    );
  }
  return context;
}
