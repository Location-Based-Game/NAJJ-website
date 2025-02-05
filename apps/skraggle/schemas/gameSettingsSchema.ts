import { z } from "zod";

export const gameSettingsSchema = z.object({
  realWordsOnly: z.boolean(),
});

export type GameSettings = z.infer<typeof gameSettingsSchema>;
