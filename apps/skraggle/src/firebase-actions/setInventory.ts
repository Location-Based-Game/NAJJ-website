"use server";
import { db } from "@/lib/firebaseAdmin";
import { getSessionData, deleteSession } from "@/lib/sessionUtils";
import { NextResponse } from "next/server";
import { ItemTypes, type ItemType } from "@/store/playersSlice";
import { v4 as uuidv4 } from "uuid";
import "server-only";

type CurrentItems = Record<
  string,
  {
    data: any;
    playerId: string;
    itemId: string;
    type: ItemTypes;
  }
>;
const letters =
  "AAAAABBCCDDDDEEEEEEFFFGGGGHHHIIIIIIJJKKLLLLMMMNNNOOOOOOPPPQRRRRRRSSSSSSTTTTTUUUUUVVWWXYYYZ___".split(
    "",
  );
type LetterBlock = ItemType<{ letter: string }>;

export async function setInventory(
    currentItems: CurrentItems,
    clearInventory: boolean = false,
    gameId:string,
    playerId:string
) {
  try {
    // const { gameId, playerId } = await getSessionData();
    const inventoriesRef = db.ref(
      `activeGames/${gameId}/inventories/${playerId}`,
    );

    const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);

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

  } catch (error) {
    // deleteSession();
    console.error(error);
  }
}
