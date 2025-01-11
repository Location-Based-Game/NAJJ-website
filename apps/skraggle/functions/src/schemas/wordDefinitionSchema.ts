import { z } from "zod";

export const wordDefinitionSchema = z.object({
    definition: z.string(),
    author: z.string(),
    word: z.string(),
    example: z.string(),
    isRealWord: z.boolean(),
})

export type WordDefinition = z.infer<typeof wordDefinitionSchema>