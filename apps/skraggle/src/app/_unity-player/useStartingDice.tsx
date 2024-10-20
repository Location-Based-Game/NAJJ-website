import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "./UnityContext";
import { InitialDiceData, PlayersData } from "@/components/GetPlayers";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebaseConfig";

export default function useStartingDice(playerData: PlayersData) {
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const { isLoaded, sendMessage } = useUnityReactContext();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);

  const isStartingDiceSet = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isGameActive) return;
    if (!gameId) return;
    if (isStartingDiceSet.current) return;

    const playersRef = ref(
      rtdb,
      `activeGames/${gameId}/players/${playerId}/diceData`,
    );
    const unsubscribe = onValue(playersRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val() as InitialDiceData;
      const { dice1, dice2 } = data;
      sendMessage("Receiver", "CreateStartingDice", dice1);
      sendMessage("Receiver", "CreateStartingDice", dice2);
      isStartingDiceSet.current = true;
    });

    return () => unsubscribe();
  }, [isLoaded, isGameActive, playerData]);
}
