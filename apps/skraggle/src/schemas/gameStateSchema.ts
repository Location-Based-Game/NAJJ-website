import { z } from "zod";

export const setGameStateSchema = z.object({
  gameState: z.enum(["Menu", "TurnsDiceRoll", "Gameplay"]),
});

export type GameStates = z.infer<typeof setGameStateSchema>["gameState"];
