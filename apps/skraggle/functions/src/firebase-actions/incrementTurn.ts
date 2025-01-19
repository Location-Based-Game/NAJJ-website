import { GameStates, PlayersData } from "../../../types";
import { db } from "../lib/firebaseAdmin";

export async function incrementTurn(
  gameId: string,
  playerId: string,
): Promise<{
  validTurn: boolean;
  gameState: GameStates;
}> {
  const gameRef = db.ref(`activeGames/${gameId}`);
  const gameStateRef = gameRef.child("gameState");
  const currentTurnRef = gameRef.child("currentTurn");
  const playersRef = gameRef.child("players");

  const players = await playersRef.get();
  const playersData = players.val() as PlayersData;
  const playerAmount = players.numChildren();
  const currentTurn = (await currentTurnRef.get()).val() as number;

  const gameState = (await gameStateRef.get()).val() as GameStates;
  //first check if current turn matches requested player's turn
  if (playersData[playerId].turn !== currentTurn) {
    return { validTurn: false, gameState };
  }

  if (gameState === "Gameplay" || gameState === "FirstTurn") {
    await currentTurnRef.transaction((currentTurn: number) => {
      if (currentTurn === null || playerAmount === 1) return currentTurn;

      let nextTurn = 0;
      //find the next online player
      for (let i = 1; i < playerAmount; i++) {
        nextTurn = (currentTurn + i) % playerAmount;
        const nextPlayer = Object.values(playersData).filter(
          (e) => e.turn === nextTurn,
        )[0];
        if (nextPlayer.isOnline) break;
      }

      return nextTurn;
    });
    
    return { validTurn: true, gameState };
  } else {
    return { validTurn: false, gameState };
  }

}
