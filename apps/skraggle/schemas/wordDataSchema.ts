import { z } from "zod";

export const wordDataSchema = z.object({
  word: z.string().regex(/^[a-zA-Z ]*$/),
  score: z.number(),
  doubleBonus: z.number(),
  tripleBonus: z.number(),
  scoreMultipliers: z.number().array(),
  firstPos: z.number().array(),
  lastPos: z.number().array(),
  blankLetters: z.string().array().optional().default([])
});

export type WordData = z.infer<typeof wordDataSchema>