import { onRequest } from "firebase-functions/v2/https";
import { getSessionData } from "../lib/getSessionData";
import { db } from "../lib/firebaseAdmin";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

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
  clearInventory: z.boolean().default(false).optional(),
  gameId: z.string().min(1),
  playerId: z.string().min(1)
}); 

export const setInventory = onRequest(async (request, response) => {
  try {
    const { gameId, playerId } = await getSessionData(request);
    const inventoriesRef = db.ref(
      `activeGames/${gameId}/inventories/${playerId}`,
    );

    const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);

    const validatedData = setInventorySchema.safeParse(request.body);
    if (!validatedData.success) {
      response.send({ error: "Invalid Data!" });
      return;
    }

    const {clearInventory, currentItems} = validatedData.data

    if (clearInventory) {
      await Promise.all([
        inventoriesRef.remove(),
        gameStateRef.set("Gameplay"),
      ]);
    }

    const letterBlocks: { [id: string]: LetterBlock } = {};

    Object.values(currentItems).forEach((item) => {
      letterBlocks[item.itemId] = {
        type: item.type,
        data: item.data,
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

    await inventoriesRef.update(letterBlocks);

    response.send({ data: "Success" });
  } catch (error) {
    response.send({ error: `${error}` });
  }
});