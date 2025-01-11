import { db } from "../lib/firebaseAdmin";
import getWordDefinitions from "../lib/getWordDefinitions";
import { letterPoints } from "../lib/letterPoints";
import {
  challengeWordRecordSchema,
  Challengers,
} from "../schemas/challengeWordSchema";
import { Inventory, ItemTypes, LetterBlock } from "../types";
import moveChallengedItemsToInventory from "./moveChallengedItemsToInventory";

export default async function calculatePoints(
  gameId: string,
  playerId: string,
): Promise<{ returnedLetters: boolean }> {
  const wordsRef = db.ref(`activeGames/${gameId}/challengeWords/words`);
  const wordsSnapshot = (await wordsRef.get()).val();
  const words = challengeWordRecordSchema.parse(wordsSnapshot);

  // Get definitions
  const wordDefinitions = await getWordDefinitions(
    Object.values(words).map((x) => x.word),
  );
  const currentDefinitionsRef = db.ref(
    `activeGames/${gameId}/currentDefinitions`,
  );
  await currentDefinitionsRef.set(wordDefinitions);

  let successfulChallengersArr: Challengers[] = [];
  let failedChallengersArr: Challengers[] = [];

  // Calculate points
  const points = Object.values(words).reduce((total, data) => {
    const definition = wordDefinitions.find(
      (e) => e.word.toLowerCase() === data.word.toLowerCase(),
    );
    if (definition === undefined) return total;

    // Add points if it's a real word
    if (definition.isRealWord) {
      for (let i = 0; i < definition.word.length; i++) {
        total += letterPoints[definition.word[i].toUpperCase()];
      }
      failedChallengersArr.push(data.challengers);
    } else if (
      !definition.isRealWord &&
      Object.keys(data.challengers).length !== 0
    ) {
      successfulChallengersArr.push(data.challengers);
    }

    return total;
  }, 0);

  // Destroy wagered items from failed challengers
  failedChallengersArr.forEach((challengers) => {
    Promise.all([
      Object.entries(challengers).map(async ([playerId, items]) => {
        const playerInventoryRef = db.ref(
          `activeGames/${gameId}/inventories/${playerId}`,
        );
        await playerInventoryRef.transaction((inventory: Inventory) => {
          if (inventory === null) return inventory;
          Object.keys(items).forEach((itemId) => {
            inventory[itemId].isDestroyed = true;
          });
          return inventory;
        });
  
        playerInventoryRef.transaction((inventory: Inventory) => {
          if (inventory === null) return inventory;
          Object.keys(items).forEach((itemId) => {
            delete inventory[itemId];
          });
          return inventory;
        });
      })
    ])
  });

  if (successfulChallengersArr.length > 0) {
    // Remove all placed letters from the board if there is at least 1 successful challenge
    successfulChallengersArr.forEach((challengers) => {
      awardPointsToChallengers(challengers, gameId);
    });

    await moveChallengedItemsToInventory(gameId, playerId);
    return { returnedLetters: true };
  } else {
    // Add points if there are no successful challengers
    const playerPointsRef = db.ref(
      `activeGames/${gameId}/players/${playerId}/points`,
    );

    await playerPointsRef.transaction((currentPoints: number) => {
      if (currentPoints === null) return 0;
      currentPoints += points;
      return currentPoints;
    });
    return { returnedLetters: false };
  }
}

function awardPointsToChallengers(challengers: Challengers, gameId: string) {
  Object.entries(challengers).forEach(([playerId, items]) => {
    const playerPointsRef = db.ref(
      `activeGames/${gameId}/players/${playerId}/points`,
    );

    // Cast items to letter blocks
    const letterBlocksArr = Object.values(items).filter(
      (e) => (e.type as ItemTypes) === ItemTypes.LetterBlock,
    ) as LetterBlock[];

    playerPointsRef.transaction((points: number) => {
      if (points === null) return 0;
      const totalPoints = letterBlocksArr
        .map((letterBlock) => {
          if (!(letterBlock.itemData.letter in letterPoints)) {
            return 0;
          }
          return letterPoints[letterBlock.itemData.letter];
        })
        .reduce((a, b) => a + b, 0);
      points += totalPoints;
      return points;
    });
  });
}
