import useSendBoardItemData from "@/app/_unity-player/useSendBoardItemData";
import useStartingDice from "@/app/_unity-player/useStartingDice";
import { rtdb } from "@/app/firebaseConfig";
import { RootState } from "@/store/store";
import { ref, onValue } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const PlayerDataContext = createContext<{
  playerData: PlayersData;
} | null>(null);

interface PlayerData {
  children: React.ReactNode;
}

export type ItemType<T> = {
  name: string;
  data: T;
};

export type Inventory = {
  [itemId: string]: ItemType<any>;
};

export type PlayersData = {
  [playerId: string]: {
    name: string;
    color: string;
    inventory: Inventory;
    turn: number;
  };
};

export default function PlayerData({ children }: PlayerData) {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const [playerData, setPlayerData] = useState<PlayersData>({});

  useStartingDice(playerData);
  useSendBoardItemData();

  useEffect(() => {
    if (!gameId) return;
    const playersRef = ref(rtdb, `activeGames/${gameId}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val() as PlayersData;
      setPlayerData(data);
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
