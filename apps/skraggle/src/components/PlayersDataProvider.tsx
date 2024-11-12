"use client"
import { rtdb } from "@/app/firebaseConfig";
import { addInitialStatus } from "@/store/peerStatusSlice";
import { RootState } from "@/store/store";
import { ref, onValue } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const PlayersDataContext = createContext<{
  playerData: PlayersData;
} | null>(null);

interface PlayerData {
  children: React.ReactNode;
}

type ItemTypes = "LetterBlock" | "StartingDice"

export type ItemType<T> = {
  type: ItemTypes;
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

export default function PlayersDataProvider({ children }: PlayerData) {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const [playerData, setPlayerData] = useState<PlayersData>({});
  const dispatch = useDispatch()

  useEffect(() => {
    if (!gameId) return;
    const playersRef = ref(rtdb, `activeGames/${gameId}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val() as PlayersData;
      setPlayerData(data);

      Object.keys(data).forEach(key => {
        dispatch(addInitialStatus(key))
      })
    });

    return () => unsubscribe();
  }, [gameId]);

  return (
    <PlayersDataContext.Provider value={{ playerData }}>
      {children}
    </PlayersDataContext.Provider>
  );
}

export function useGetPlayers() {
  const context = useContext(PlayersDataContext);
  if (!context) {
    throw new Error(
      "useGetPlayers must be used within a PlayerDataContextProvider",
    );
  }
  return context;
}
