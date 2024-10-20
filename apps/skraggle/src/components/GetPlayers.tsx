import useStartingDice from "@/app/_unity-player/useStartingDice";
import { rtdb } from "@/app/firebaseConfig";
import { useToast } from "@/hooks/use-toast";
import { mainMenuState, RootState } from "@/store/store";
import { ref, onValue } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const PlayerDataContext = createContext<{
  playerData: PlayersData;
} | null>(null);

interface PlayerData {
  children: React.ReactNode;
}

export type InitialDiceData = {
  dice1: number;
  dice2: number;
};

export type PlayersData = {
  [playerId: string]: {
    name: string;
    diceData: InitialDiceData;
  };
};

export default function PlayerData({ children }: PlayerData) {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const [playerData, setPlayerData] = useState<PlayersData>({});
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleError = (message: string) => {
    console.error(message);

    toast({
      title: "Error",
      variant: "destructive",
      description: message,
    });

    dispatch(
      mainMenuState.updateState({
        state: "Home",
        slideFrom: "left",
      }),
    );
  };

  useStartingDice(playerData);

  useEffect(() => {
    if (!gameId) return;
    const playersRef = ref(rtdb, `activeGames/${gameId}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      if (gameId) {
        if (!snapshot.exists()) return;
        const data = snapshot.val() as PlayersData;
        setPlayerData(data);
      } else {
        handleError("Game not available! Try creating a game.");
      }
    });

    return () => unsubscribe();
  }, [gameId]);

  return (
    <PlayerDataContext.Provider value={{ playerData }}>
      {children}
    </PlayerDataContext.Provider>
  );
}

export function useGetPlayers() {
  const context = useContext(PlayerDataContext);
  if (!context) {
    throw new Error(
      "useGetPlayers must be used within a PlayerDataContextProvider",
    );
  }
  return context;
}
