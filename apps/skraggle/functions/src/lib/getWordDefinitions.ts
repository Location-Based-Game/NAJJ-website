import {
  urbanDictionaryAPISchema,
  UrbanDictionaryDefinition,
} from "../schemas/urbanDictionaryDefinitionSchema";
import { WordDefinition } from "../schemas/wordDefinitionSchema";

export default async function getWordDefinitions(
  words: string[],
): Promise<WordDefinition[]> {
  //remove duplicates
  words = [...new Set(words)];

  const urbanDictionaryDefinitions = await Promise.all(
    words.map(async (word) => {
      const res = await fetch(
        `https://api.urbandictionary.com/v0/define?term=${word}`,
      );
      const data = await res.json();
      const { list } = urbanDictionaryAPISchema.parse(data);
      const topDefinition = list
        .filter((e) => e.word.toLowerCase() === word.toLowerCase())
        .reduce(
          (max, current) => {
            return current.thumbs_up > max.thumbs_up ? current : max;
          },
          { thumbs_up: -1 } as UrbanDictionaryDefinition,
        );

      return topDefinition.thumbs_up > 200
        ? topDefinition
        : ({ word } as UrbanDictionaryDefinition);
    }),
  );

  const parsedDefinitions = urbanDictionaryDefinitions.map<WordDefinition>(
    (data) => {
      if (!data.hasOwnProperty("definition")) {
        return {
          definition: "This is a made up word!",
          author: "",
          word: data.word,
          example: "",
          isRealWord: false,
        };
      }

      return {
        definition: data.definition,
        author: data.author,
        word: data.word,
        example: data.example,
        isRealWord: true,
      };
    },
  );

  return parsedDefinitions;
}
