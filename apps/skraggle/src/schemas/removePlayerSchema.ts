import { gameIdSchema } from "@/schemas/gameIdSchema";
import { z } from "zod";

export const playerKeySchema = gameIdSchema.extend({
  playerKey: z.string().min(1),
});

export type PlayerKeyType = z.infer<typeof playerKeySchema>;
