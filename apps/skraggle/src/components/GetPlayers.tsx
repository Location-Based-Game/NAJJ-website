import { rtdb } from "@/app/firebaseConfig";
import { useToast } from "@/hooks/use-toast";
import { mainMenuState } from "@/state/store";
import { ref, onValue } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const PlayerDataContext = createContext<{
  setJoinCode: React.Dispatch<React.SetStateAction<string | null>>;
  playerData: string[];
} | null>(null);

interface PlayerData {
  children: React.ReactNode;
}

export default function PlayerData({ children }: PlayerData) {
  const [joinCode, setJoinCode] = useState<string | null>("");
  const [playerData, setPlayerData] = useState<string[]>([]);
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

  useEffect(() => {
    if (!joinCode) return;
    const playersRef = ref(rtdb, `activeGames/${joinCode}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      console.log(joinCode)
      if (snapshot.exists() && joinCode) {
        const data = snapshot.val();
        setPlayerData(data);
      } else {
        handleError("Game not available! Try creating a game.");
      }
    });

    return () => unsubscribe();
  }, [joinCode]);

  return (
    <PlayerDataContext.Provider value={{ setJoinCode, playerData }}>
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
