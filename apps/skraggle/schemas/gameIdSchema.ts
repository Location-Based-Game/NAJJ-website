import { z } from "zod";

export const gameIdSchema = z.object({
  gameId: z.string().regex(/^[a-z0-9]{4}$/),
});

export type GameIdType = z.infer<typeof gameIdSchema>