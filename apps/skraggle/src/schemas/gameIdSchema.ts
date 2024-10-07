import { z } from "zod";

export const gameIdSchema = z.object({
  gameId: z.string().length(4),
});

export type GameIdType = z.infer<typeof gameIdSchema>