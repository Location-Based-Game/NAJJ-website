import { ItemType } from "@/components/GetPlayers";
import { db } from "@/lib/firebaseAdmin";
import { deleteSession, getSessionData } from "@/lib/sessionUtils";
import { validateSearchParams } from "@/lib/validateSearchParams";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

const getLetterBlockSchema = z.object({
  amount: z.string().min(1),
  clearInventory: z.enum(["true", "false"])
});

const letters = 'AAAAABBCCDDDDEEEEEEFFFGGGGHHHIIIIIIJJKKLLLLMMMNNNOOOOOOPPPQRRRRRRSSSSSSTTTTTUUUUUVVWWXYYYZ___'.split(''); 
type LetterBlock = ItemType<string>;

//GET LETTER BLOCK
export async function GET(request: NextRequest) {
  const { amount, clearInventory } = validateSearchParams<z.infer<typeof getLetterBlockSchema>>(
    request.url,
    getLetterBlockSchema,
  );

  try {
    const { gameId, playerId } = await getSessionData();
    const inventoryRef = db.ref(
      `activeGames/${gameId}/players/${playerId}/inventory`,
    );

    if (clearInventory === "true") {
      await inventoryRef.remove();
    }

    const letterBlocks: {[id:string]:LetterBlock} = {}

    for (let i = 0; i < parseInt(amount); i++) {
      const randomIndex = Math.floor(Math.random() * letters.length)
      const randomLetter = letters[randomIndex]
      letterBlocks[`${randomLetter}-${uuidv4()}`] = {type: "LetterBlock", data: randomLetter}
    }

    await inventoryRef.update(letterBlocks)

    return NextResponse.json({ data: "Success" });
  } catch (error) {
    deleteSession();
    console.error(error);
    return NextResponse.json({ error: `${error}` });
  }
}