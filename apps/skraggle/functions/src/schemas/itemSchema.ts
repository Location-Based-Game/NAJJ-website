import { z } from "zod";
import { ItemTypes } from "../types";

export const itemSchema = z.object({
  itemData: z.any(),
  playerId: z.string().min(1),
  itemId: z.string().min(1),
  type: z.nativeEnum(ItemTypes),
  isPlaced: z.boolean().default(false),
  //Vector2 float array. If length = 0, object is on stand
  gridPosition: z.number().array().default([]),
  standOrder: z.number().optional()
});

export type Item<T> = Omit<z.infer<typeof itemSchema>, "itemData"> & {
  itemData: T;
};