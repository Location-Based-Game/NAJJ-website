import { z } from "zod";
import { itemSchema } from "./itemSchema";

export const currentItemsSchema = z.object({
  currentItems: z.record(z.string(), itemSchema),
});

export type CurrentItemsType = z.infer<typeof currentItemsSchema>;
