import { z } from "zod";
import { wordDataSchema } from "./wordDataSchema";
import { Item } from "./itemSchema";
import { currentItemsSchema } from "./currentItemsSchema";

export const challengeWordSchema = wordDataSchema
  .extend({
    challengers: z.record(z.record(z.custom<Item<any>>())).optional(),
  })
export type ChallengeWordType = z.infer<typeof challengeWordSchema>;

export const challengeWordRecordSchema = z.record(challengeWordSchema)
export type ChallengeWordsRecord = z.infer<typeof challengeWordRecordSchema>;

export const submittedChallengeWordsSchema = currentItemsSchema.extend({
    submittedChallengeWords: challengeWordRecordSchema,
})

export type SubmittedChallengeWords = z.infer<typeof submittedChallengeWordsSchema>