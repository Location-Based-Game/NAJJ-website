import { RootState } from "@/store/store";
import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";

export const GamePlayUIContext = createContext<{
  showGameplayUI: boolean;
} | null>(null);

export default function GameplayUIContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showGameplayUI, setShowGameplayUI] = useState(false);
  const handleShowGamePlayUI = useCallback(() => {
    setShowGameplayUI(true);
  }, []);
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const { addEventListener, removeEventListener } = useUnityReactContext();

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
    <GamePlayUIContext.Provider value={{ showGameplayUI }}>
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
