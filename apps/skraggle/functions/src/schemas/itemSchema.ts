import { z } from "zod";
import { ItemTypes } from "../types";

export const itemSchema = z.object({
  data: z.any(),
  playerId: z.string().min(1),
  itemId: z.string().min(1),
  type: z.nativeEnum(ItemTypes),
  //Vector2 float array. If length = 0, object is not placed on grid
  gridPosition: z.number().array().default([]),
});

export type Item<T> = Omit<z.infer<typeof itemSchema>, "data"> & {
  data: T;
};