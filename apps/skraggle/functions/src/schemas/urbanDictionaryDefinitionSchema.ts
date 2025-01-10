import { z } from "zod";

export const urbanDictionaryDefinitionSchema = z.object({
    definition: z.string().optional().default("This is a made up word!"),
    permalink: z.string().optional().default(""),
    thumbs_up: z.number().optional().default(0),
    author: z.string().optional().default(""),
    word: z.string(),
    defid: z.number().optional().default(-1),
    written_on: z.string().optional().default(""),
    example: z.string().optional().default(""),
    thumbs_down: z.number().optional().default(0),
    real_word: z.boolean().optional().default(false),
})

export type UrbanDictionaryDefinition = z.infer<typeof urbanDictionaryDefinitionSchema>

export const urbanDictionaryAPISchema = z.object({
    list: urbanDictionaryDefinitionSchema.array()
})

export type UrbanDictionaryAPI = z.infer<typeof urbanDictionaryAPISchema>