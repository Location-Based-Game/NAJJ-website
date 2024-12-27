import { z } from "zod";
import { TileType } from "../types";

const wordDataSchema = z.object({
  word: z.string().regex(/^[a-zA-Z0-9 ]*$/),
  score: z.number(),
  doubleBonus: z.number(),
  tripleBonus: z.number(),
  scoreMultipliers: z.custom<TileType>().array(), // Replace `z.any()` with the schema for TileType if defined
  firstPos: z.number().array(),
  lastPos: z.number().array(),
});

export type WordData = z.infer<typeof wordDataSchema>

export const submittedWordSchema = z.object({
  wordsData: z.custom<WordData>().array(),
});

export type SubmittedWordType = z.infer<typeof submittedWordSchema>;
