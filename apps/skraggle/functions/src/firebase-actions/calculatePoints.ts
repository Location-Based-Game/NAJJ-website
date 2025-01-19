import { ChallengeWordsData, Challengers } from "../../../schemas/challengerSchema";
import { WordData } from "../../../schemas/wordDataSchema";
import { Inventory, TileType, ItemTypes, LetterBlock } from "../../../types";
import { db } from "../lib/firebaseAdmin";
import getWordDefinitions from "../lib/getWordDefinitions";
import { letterPoints } from "../../../shared/letterPoints";
import moveChallengedItemsToInventory from "./moveChallengedItemsToInventory";

export default async function calculatePoints(
  gameId: string,
  challengeWordsData: ChallengeWordsData,
): Promise<{ returnedLetters: boolean }> {
  const { words, playerId, countdown } = challengeWordsData;

  // Give 1 second of leeway for good measure
  if ((countdown.seconds - 1) * 1000 - (Date.now() - countdown.startAt) > 0) {
    throw new Error("Cannot end turn prematurely!")
  }

  // Get definitions
  const wordDefinitions = await getWordDefinitions(
    Object.values(words).map((x) => x.word),
  );
  const currentDefinitionsRef = db.ref(
    `activeGames/${gameId}/currentDefinitions`,
  );
  await currentDefinitionsRef.set(wordDefinitions);

  const successfulChallengersArr: Challengers[] = [];
  const failedChallengersArr: Challengers[] = [];

  // Calculate points
  const points = Object.values(words).reduce((total, data) => {
    const definition = wordDefinitions.find(
      (e) => e.word.toLowerCase() === data.word.toLowerCase(),
    );
    if (definition === undefined) return total;

    // Add points if it's a real word or if there are no challengers
    if (definition.isRealWord || Object.keys(data.challengers).length === 0) {
      total += calculateWordPoints(data);
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
      }),
    ]);
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

function calculateWordPoints(wordData: WordData) {
  let wordPoints = 0;
  for (let i = 0; i < wordData.word.length; i++) {
    wordPoints += letterPoints[wordData.word[i].toUpperCase()];
  }
  wordPoints += wordData.doubleBonus + wordData.tripleBonus;
  wordData.scoreMultipliers.forEach((multiplier: TileType) => {
    if (multiplier === TileType.TripleWordScore) {
      wordPoints *= 3;
    } else if (multiplier === TileType.DoubleWordScore) {
      wordPoints *= 2;
    }
  });
  return wordPoints;
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
