import { dictionaryAPIValidWordSchema } from "../schemas/dictionaryAPISchema";
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

  const definitions = await Promise.all(
    words.map(async (word) => {
      const urbanDictionaryDefs = await getUrbanDictionaryDefinition(word);
      if (!urbanDictionaryDefs) {
        const dictionaryAPIDefs = await getDictionaryAPIDefinition(word);
       
        // No definitions found
        if (!dictionaryAPIDefs) {
          return { word } as WordDefinition
        }

        return dictionaryAPIDefs;
      }
      return urbanDictionaryDefs;
    }),
  );

  const parsedDefinitions = definitions.map<WordDefinition>((data) => {
    if (!data.hasOwnProperty("definition")) {
      return {
        definition: "",
        author: "",
        word: data.word,
        example: "",
        isRealWord: false,
      };
    }

    return data;
  });

  return parsedDefinitions;
}

async function getDictionaryAPIDefinition(
  word: string,
): Promise<WordDefinition | false> {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
  const data = await res.json();
  const parsedData = dictionaryAPIValidWordSchema.safeParse(data)
  if (parsedData.success) {
    const [data] = parsedData.data
    return {
      definition: data.meanings[0].definitions[0].definition,
      author: "",
      word: data.word,
      example: data.meanings[0].definitions[0].example,
      isRealWord: true,
    }
  }

  return false
}

async function getUrbanDictionaryDefinition(
  word: string,
): Promise<WordDefinition | false> {
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

  if (topDefinition.thumbs_up > 200) {
    return {
      definition: topDefinition.definition,
      author: topDefinition.author,
      word: topDefinition.word,
      example: topDefinition.example,
      isRealWord: true,
    };
  }

  return false;
}
