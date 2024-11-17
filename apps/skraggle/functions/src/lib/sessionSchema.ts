import { z } from "zod"


export const sessionSchema = z.object({
    gameId: z.string().regex(/^[a-z0-9]{4}$/),
    playerId: z.string(),
    playerName: z.string()
})

export type SessionData = z.infer<typeof sessionSchema>