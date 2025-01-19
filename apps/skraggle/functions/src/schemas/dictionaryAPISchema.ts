import { z } from "zod";

export const dictionaryAPIValidWordSchema = z
  .object({
    word: z.string(),
    meanings: z
      .object({
        partOfSpeech: z.string(),
        definitions: z
          .object({
            definition: z.string(),
            example: z.string().optional().default(""),
          })
          .array(),
      })
      .array(),
    license: z.object({
      name: z.string(),
      url: z.string(),
    }),
    sourceUrls: z.string().array().optional().default([]),
  })
  .array();

export type DictionaryAPIValidWord = z.infer<
  typeof dictionaryAPIValidWordSchema
>;

export const dictionaryAPIInvalidWordSchema = z.object({
  title: z.string(),
  message: z.string(),
  resolution: z.string(),
});
