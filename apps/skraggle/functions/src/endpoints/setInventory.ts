import { onRequest } from "firebase-functions/v2/https";
import { deleteSession, getSessionData } from "../lib/sessionUtils";
import { db } from "../lib/firebaseAdmin";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { GameStates, Inventory, ItemTypes, StartingDice } from "../types";
import { type Item, itemSchema } from "../schemas/itemSchema";
import * as logger from "firebase-functions/logger";

// import * as logger from "firebase-functions/logger";
type LetterBlock = Item<{ letter: string }>;
const letters =
  "AAAAABBCCDDDDEEEEEEFFFGGGGHHHIIIIIIJJKKLLLLMMMNNNOOOOOOPPPQRRRRRRSSSSSSTTTTTUUUUUVVWWXYYYZ___".split(
    "",
  );
const setInventorySchema = z.object({
  currentItems: z.record(z.string(), itemSchema),
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

      //remove placed items from player inventory and store them on the grid
      const gridRef = db.ref(`activeGames/${gameId}/grid`);
      const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
      const gameState = (await gameStateRef.get()).val() as GameStates;

      await Promise.all(
        Object.values(currentItems)
          .filter((item) => item.isPlaced || item.type === ItemTypes.StartingDice)
          .map(async (item) => {
            await inventoriesRef.child(item.itemId).remove();
            delete currentItems[item.itemId];
            await gridRef.child(item.itemId).set(item);

            if (gameState === "TurnsDiceRoll" && item.type === ItemTypes.StartingDice) {
              await SetDiceInventory(JSON.parse(item.itemData).playerAmount);
            }
          }),
      );

      if (gameState === "Gameplay") {
        const letterBlocks = GetLetterBlocks(
          currentItems as Inventory,
          playerId,
        );
        await inventoriesRef.set({ ...currentItems, ...letterBlocks });
      } else {
        await inventoriesRef.set({ ...currentItems });
      }

      async function SetDiceInventory(playerCount: number) {
        const diceCount = (await gridRef.get()).numChildren();
        if (diceCount === playerCount * 2) {
          await gameStateRef.set("Gameplay");
          //Clears grid. Might change later
          await gridRef.remove();
        }
      }

      response.send({ data: "Success" });
    } catch (error) {
      deleteSession(response);
      response.send({ error: `${error}` });
    }
  },
);

export function GetLetterBlocks(currentItems: Inventory, playerId: string) {
  const letterBlocks: Record<string, LetterBlock> = {};
  const lettersOnStandCount = Object.values(currentItems).filter((item) => {
    if (item.type !== ItemTypes.LetterBlock) return false;
    //check if letter is on grid
    return !item.isPlaced;
  }).length;

  //give letterBlocks for every letter that is not placed on grid
  for (let i = 0; i < 7 - lettersOnStandCount; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    const randomLetter = letters[randomIndex];
    const itemId = `${randomLetter}-${uuidv4()}`;
    letterBlocks[itemId] = {
      itemData: { letter: randomLetter },
      playerId,
      itemId,
      type: ItemTypes.LetterBlock,
      isPlaced: false,
      gridPosition: [],
    };
  }

  return letterBlocks;
}
