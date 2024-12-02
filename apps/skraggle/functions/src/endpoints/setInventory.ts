import { onRequest } from "firebase-functions/v2/https";
import { deleteSession, getSessionData } from "../lib/sessionUtils";
import { db } from "../lib/firebaseAdmin";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { ItemTypes } from "../types";
import { type Item, itemSchema } from "../schemas/itemSchema";

// import * as logger from "firebase-functions/logger";
type LetterBlock = Item<{ letter: string }>;
const letters =
  "AAAAABBCCDDDDEEEEEEFFFGGGGHHHIIIIIIJJKKLLLLMMMNNNOOOOOOPPPQRRRRRRSSSSSSTTTTTUUUUUVVWWXYYYZ___".split(
    "",
  );
const setInventorySchema = z.object({
  currentItems: z.record(
    z.string(),
    itemSchema
  )
});

export type SetInventorySchemaType = z.infer<typeof setInventorySchema>;

export const setInventory = onRequest(
  { cors: true },
  async (request, response) => {
    response.set("Access-Control-Allow-Credentials", "true");

    try {
      const { gameId, playerId } = await getSessionData(request);
      const inventoriesRef = db.ref(
        `activeGames/${gameId}/inventories/${playerId}`,
      );

      const validatedData = setInventorySchema.safeParse(
        JSON.parse(request.body),
      );
      if (!validatedData.success) {
        response.send({ error: "Invalid Data!" });
        return;
      }

      const { currentItems } = validatedData.data;

      const letterBlocks: Record<string, LetterBlock> = {};
      
      const lettersOnStandCount = Object.values(currentItems).filter((item) => {
        if (item.type !== ItemTypes.LetterBlock) return false;
        //check if letter is on grid
        return item.gridPosition.length === 0;
      }).length;

      //give letterBlocks for every letter that is not placed on grid
      for (let i = 0; i < 7 - lettersOnStandCount; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        const randomLetter = letters[randomIndex];
        const itemId = `${randomLetter}-${uuidv4()}`
        letterBlocks[itemId] = {
          data: { letter: randomLetter },
          playerId,
          itemId,
          type: ItemTypes.LetterBlock,
          gridPosition: []
        };
      }

      const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
      await Promise.all([
        gameStateRef.set("Gameplay"),
        inventoriesRef.set({ ...currentItems, ...letterBlocks }),
      ]);

      response.send({ data: "Success" });
    } catch (error) {
      deleteSession(response);
      response.send({ error: `${error}` });
    }
  },
);
