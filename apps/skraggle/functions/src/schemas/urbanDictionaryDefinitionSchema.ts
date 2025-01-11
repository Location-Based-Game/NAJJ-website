import { z } from "zod";

export const urbanDictionaryDefinitionSchema = z.object({
    definition: z.string(),
    permalink: z.string(),
    thumbs_up: z.number(),
    author: z.string(),
    word: z.string(),
    defid: z.number(),
    written_on: z.string(),
    example: z.string(),
    thumbs_down: z.number(),
})

export type UrbanDictionaryDefinition = z.infer<typeof urbanDictionaryDefinitionSchema>

export const urbanDictionaryAPISchema = z.object({
    list: urbanDictionaryDefinitionSchema.array()
})

export type UrbanDictionaryAPI = z.infer<typeof urbanDictionaryAPISchema>