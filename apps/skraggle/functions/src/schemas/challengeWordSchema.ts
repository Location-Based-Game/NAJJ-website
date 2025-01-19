import { z } from "zod";
import { wordDataSchema } from "./wordDataSchema";
import { currentItemsSchema } from "./currentItemsSchema";
import { Inventory } from "../types";

export const challengersSchema = z
  .record(z.custom<Inventory>())
  .optional()
  .default({});
export type Challengers = z.infer<typeof challengersSchema>;

export const challengeWordSchema = wordDataSchema.extend({
  challengers: challengersSchema,
});
export type ChallengeWordType = z.infer<typeof challengeWordSchema>;

export const challengeWordRecordSchema = z.record(challengeWordSchema);
export type ChallengeWordsRecord = z.infer<typeof challengeWordRecordSchema>;

export const submittedChallengeWordsSchema = currentItemsSchema.extend({
  submittedChallengeWords: challengeWordRecordSchema,
});

export type SubmittedChallengeWords = z.infer<
  typeof submittedChallengeWordsSchema
>;

// Challenge words DB root
export const challengeWordsDataSchema = z.object({
  playerId: z.string(),
  words: challengeWordRecordSchema,
  placedLetters: z.custom<Inventory>(),
  countdown: z.object({
    startAt: z.any(),
    seconds: z.number()
  })
})

export type ChallengeWordsData = z.infer<typeof challengeWordsDataSchema>