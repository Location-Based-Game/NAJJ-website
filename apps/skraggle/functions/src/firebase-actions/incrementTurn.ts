import { db } from "../lib/firebaseAdmin";
import { GameStates, PlayersData } from "../types";

export async function incrementTurn(gameId: string, playerId: string) {
  const gameRef = db.ref(`activeGames/${gameId}`);
  const gameStateRef = gameRef.child("gameState");
  const currentTurnRef = gameRef.child("currentTurn");
  const playersRef = gameRef.child("players");

  const players = await playersRef.get();
  const playersData = players.val() as PlayersData;
  const playerAmount = players.numChildren();
  const currentTurn = (await currentTurnRef.get()).val() as number;

  //first check if current turn matches requested player's turn
  if (playersData[playerId].turn !== currentTurn) return;

  const gameState = (await gameStateRef.get()).val() as GameStates;
  if (gameState !== "Gameplay") return;

  await currentTurnRef.transaction((currentTurn: number) => {
    if (currentTurn === null || playerAmount === 1) return currentTurn;

    let nextTurn: number = 0;
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
}
