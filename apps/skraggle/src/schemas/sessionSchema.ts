import { z } from "zod";
import { gameIdSchema } from "./gameIdSchema";

export const sessionSchema = gameIdSchema.extend({
    playerId: z.string(),
    playerName: z.string()
})

export type SessionData = z.infer<typeof sessionSchema>