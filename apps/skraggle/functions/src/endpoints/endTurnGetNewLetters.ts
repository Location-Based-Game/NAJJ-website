import { incrementTurn } from "../firebase-actions/incrementTurn";
import { db } from "../lib/firebaseAdmin";
import { getLetterBlocks } from "../lib/getLetterBlocks";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";
import { ChallengeWordsRecord } from "../schemas/challengeWordSchema";
import { currentItemsSchema } from "../schemas/currentItemsSchema";
import { urbanDictionaryAPISchema, UrbanDictionaryDefinition } from "../schemas/urbanDictionaryDefinitionSchema";
import { GameStates, Inventory } from "../types";

export const endTurnGetNewLetters = onAuthorizedRequest(
  async (request, response) => {
    const validatedData = currentItemsSchema.safeParse(
      JSON.parse(request.body),
    );
    if (!validatedData.success) {
      response.send({ error: "Invalid Data!" });
      return;
    }
    const { currentItems } = validatedData.data;

    const { gameId, playerId } = await getSessionData(request);
    const { validTurn, gameState } = await incrementTurn(gameId, playerId);

    const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
    if (validTurn && gameState === "FirstTurn") {
      const newState: GameStates = "Gameplay";
      await gameStateRef.set(newState);
    }

    const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
    const wordsRef = challengeWordsRef.child("words");
    const wordsSnapshot = (await wordsRef.get()).val() as ChallengeWordsRecord;

    const wordDefinitions = await getWordDefinitions(
      Object.values(wordsSnapshot).map((x) => x.word),
    );
    const currentDefinitionsRef = db.ref(`activeGames/${gameId}/currentDefinitions`);
    await currentDefinitionsRef.set(wordDefinitions)

    await challengeWordsRef.remove();

    // Get new letter blocks
    const inventoriesRef = db.ref(
      `activeGames/${gameId}/inventories/${playerId}`,
    );
    const letterBlocks = getLetterBlocks(currentItems as Inventory, playerId);
    await inventoriesRef.set({ ...currentItems, ...letterBlocks });

    response.send({ data: "Success" });
  },
);

async function getWordDefinitions(
  words: string[],
): Promise<UrbanDictionaryDefinition[]> {
  //remove duplicates
  words = [...new Set(words)];

  return await Promise.all(
    words.map(async (word) => {
      const res = await fetch(
        `https://api.urbandictionary.com/v0/define?term=${word}`,
      );
      const data = await res.json();
      const { list } = urbanDictionaryAPISchema.parse(data)
      const topDefinition = list
        .filter((e) => e.word.toLowerCase() === word.toLowerCase())
        .reduce(
          (max, current) => {
            return current.thumbs_up > max.thumbs_up ? current : max;
          },
          { thumbs_up: -1 } as UrbanDictionaryDefinition,
        );

      return topDefinition.thumbs_up > 200
        ? { ...topDefinition, real_word: true }
        : ({ word, real_word: false } as UrbanDictionaryDefinition);
    }),
  );
}
