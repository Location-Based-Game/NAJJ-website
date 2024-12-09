import { db } from "../lib/firebaseAdmin";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";
import { PlayersData } from "../types";

export const endTurn = onAuthorizedRequest(async (request, response) => {
  const { gameId, playerId } = await getSessionData(request);

  const turnRef = db.ref(`activeGames/${gameId}/currentTurn`);
  const playersRef = db.ref(`activeGames/${gameId}/players`);

  const players = await playersRef.get();
  const playersData = players.val() as PlayersData;
  const playerAmount = players.numChildren();

  await turnRef.transaction((currentTurn: number) => {
    if (currentTurn === null || playerAmount === 1)
      return currentTurn;

    //first check if current turn matches requested player's turn
    if (playersData[playerId].turn !== currentTurn) {
      throw new Error("Cannot increment turn when it's not your turn!");
    }

    let nextTurn:number = 0;
    //find the next online player
    for (let i = 1; i < playerAmount; i++) {
        nextTurn = (currentTurn + i) % playerAmount
        const nextPlayer = Object.values(playersData).filter(e => e.turn === nextTurn)[0]
        if (nextPlayer.isOnline) break;
    }

    return nextTurn;
  });

  response.send({ data: "Success" });
});
