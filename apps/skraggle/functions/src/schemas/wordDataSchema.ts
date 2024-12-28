import { z } from "zod";

export const wordDataSchema = z.object({
  word: z.string().regex(/^[a-zA-Z0-9 ]*$/),
  score: z.number(),
  doubleBonus: z.number(),
  tripleBonus: z.number(),
  scoreMultipliers: z.number().array(),
  firstPos: z.number().array(),
  lastPos: z.number().array(),
});

export type WordData = z.infer<typeof wordDataSchema>