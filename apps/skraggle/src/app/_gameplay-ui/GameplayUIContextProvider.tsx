import { RootState } from "@/store/store";
import React, {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { ChallengeWordsRecord } from "@schemas/challengerSchema";
import useSetInventories from "./useSetInventories";
import { CurrentItemsType } from "@schemas/currentItemsSchema";
import useWebRTC from "./useWebRTC";

export const GamePlayUIContext = createContext<{
  showGameplayUI: boolean;
  challengeWords: ChallengeWordsRecord;
  setChallengeWords: React.Dispatch<React.SetStateAction<ChallengeWordsRecord>>;
  getCurrentItems: () => Promise<CurrentItemsType>;
  setShowExpandPreviewButton: React.Dispatch<React.SetStateAction<boolean>>;
  showExpandPreviewButton: boolean;
  currentWageredLetters: React.MutableRefObject<string[]>
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
  const [showExpandPreviewButton, setShowExpandPreviewButton] = useState(true);

  const handleShowGamePlayUI = useCallback(() => {
    setShowGameplayUI(true);
  }, []);
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const { addEventListener, removeEventListener } = useUnityReactContext();
  const { getCurrentItems } = useSetInventories();
  const currentWageredLetters = useRef<string[]>([])
  useWebRTC();

  const handleShowExpandPreviewButton = () => setShowExpandPreviewButton(true);

  useEffect(() => {
    if (!isGameActive) {
      setShowGameplayUI(false);
    }
    addEventListener("ShowGamePlayUI", handleShowGamePlayUI);
    addEventListener(
      "ShowOtherPlayerPreviewButton",
      handleShowExpandPreviewButton,
    );

    return () => {
      removeEventListener("ShowGamePlayUI", handleShowGamePlayUI);
      removeEventListener(
        "ShowOtherPlayerPreviewButton",
        handleShowExpandPreviewButton,
      );
    };
  }, [
    addEventListener,
    removeEventListener,
    handleShowGamePlayUI,
    isGameActive,
  ]);

  return (
    <GamePlayUIContext.Provider
      value={{
        showGameplayUI,
        challengeWords,
        setChallengeWords,
        getCurrentItems,
        showExpandPreviewButton,
        setShowExpandPreviewButton,
        currentWageredLetters
      }}
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
