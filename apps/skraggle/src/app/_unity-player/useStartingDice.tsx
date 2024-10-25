import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "./UnityContext";
import { PlayersData } from "@/components/GetPlayers";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebaseConfig";

export default function useStartingDice(playerData: PlayersData) {
  const { isGameActive, state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const { callUnityFunction } = useUnityReactContext();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);

  const isStartingDiceSet = useRef(false);

  useEffect(() => {
    if (!isGameActive) return;
    if (!gameId) return;
    if (isStartingDiceSet.current) return;

    const playersRef = ref(rtdb, `activeGames/${gameId}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val() as PlayersData;
      if (!data[playerId].diceData) return;

      //spawn players
      Object.keys(data).forEach((key) => {
        const { turn } = data[key];
        console.log(`added ${data[key].name}`);
        callUnityFunction("AddPlayer", {
          turn,
          playerId: key,
          isMainPlayer: key === playerId,
        });
      });

      //add dice
      Object.keys(data).forEach((key) => {
        const { dice1, dice2 } = data[key].diceData;
        console.log(key);
        callUnityFunction("CreateStartingDice", {
          playerId: key,
          value: dice1,
        });
        callUnityFunction("CreateStartingDice", {
          playerId: key,
          value: dice2,
        });
      });
      isStartingDiceSet.current = true;
    });

    return () => unsubscribe();
  }, [isGameActive, playerData, gameState]);
}
