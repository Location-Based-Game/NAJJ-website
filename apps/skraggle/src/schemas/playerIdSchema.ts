import { gameIdSchema } from "@/schemas/gameIdSchema";
import { z } from "zod";

export const playerIdSchema = gameIdSchema.extend({
  playerId: z.string().min(1),
});

export type PlayerIdType = z.infer<typeof playerIdSchema>;
