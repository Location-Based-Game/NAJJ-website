import { onRequest } from "firebase-functions/v2/https";
import { getSessionData } from "../lib/getSessionData";
import { db } from "../lib/firebaseAdmin";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import * as logger from "firebase-functions/logger";

export enum ItemTypes {
  StartingDice,
  LetterBlock,
}

export type ItemType<T> = {
  type: ItemTypes;
  data: T;
};

// import * as logger from "firebase-functions/logger";
type LetterBlock = ItemType<{ letter: string }>;
const letters =
  "AAAAABBCCDDDDEEEEEEFFFGGGGHHHIIIIIIJJKKLLLLMMMNNNOOOOOOPPPQRRRRRRSSSSSSTTTTTUUUUUVVWWXYYYZ___".split(
    "",
  );
const setInventorySchema = z.object({
  currentItems: z.record(
    z.string(),
    z.object({
      data: z.any(),
      playerId: z.string().min(1),
      itemId: z.string().min(1),
      type: z.nativeEnum(ItemTypes),
    }),
  ),
  gameId: z.string().min(1),
  playerId: z.string().min(1),
});

export type SetInventorySchemaType = z.infer<typeof setInventorySchema>;

export const setInventory = onRequest(
  { cors: true },
  async (request, response) => {
    response.set("Access-Control-Allow-Credentials", "true")

    try {
      const { gameId, playerId } = await getSessionData(request);
      const inventoriesRef = db.ref(
        `activeGames/${gameId}/inventories/${playerId}`,
      );

      const validatedData = setInventorySchema.safeParse(JSON.parse(request.body));
      if (!validatedData.success) {
        response.send({ error: "Invalid Data!" });
        return;
      }

      const { currentItems } = validatedData.data;

      const letterBlocks: { [id: string]: LetterBlock } = {};

      Object.values(currentItems).forEach((item) => {
        letterBlocks[item.itemId] = {
          type: item.type,
          data: JSON.parse(item.data),
        };
      });

      const amount = Object.values(currentItems).filter(
        (item) => item.type === ItemTypes.LetterBlock,
      ).length;

      for (let i = 0; i < 7 - amount; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        const randomLetter = letters[randomIndex];
        letterBlocks[`${randomLetter}-${uuidv4()}`] = {
          type: ItemTypes.LetterBlock,
          data: { letter: randomLetter },
        };
      }

      const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
      await Promise.all([
        gameStateRef.set("Gameplay"),
        inventoriesRef.set({ ...currentItems, ...letterBlocks })
      ])

      response.send({ data: "Success" });
    } catch (error) {
      response.send({ error: `${error}` });
    }
  },
);
