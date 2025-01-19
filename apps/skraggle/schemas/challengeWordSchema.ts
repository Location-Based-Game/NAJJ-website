import { LetterBlock } from "../types";
import { z } from "zod";

export const challengeWordSchema = z.object({
  wordId: z.string(),
  wageredLetters: z.record(z.custom<LetterBlock>()),
});

export type ChallengeWordSchemaType = z.infer<typeof challengeWordSchema>;