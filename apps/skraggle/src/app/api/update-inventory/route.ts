import { db } from "@/lib/firebaseAdmin";
import { getSessionData, deleteSession } from "@/lib/sessionUtils";
import { validateSearchParams } from "@/lib/validateSearchParams";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateInventorySchema = z.object({
  data: z.string().optional(),
});

const updateInventorySchemaJSON = z.record(z.string(), z.string());

//UPDATE INVENTORY
export async function GET(request: NextRequest) {
  const { data } = validateSearchParams<z.infer<typeof updateInventorySchema>>(
    request.url,
    updateInventorySchema,
  );

  try {
    const { gameId, playerId } = await getSessionData();
    const inventoryRef = db.ref(
      `activeGames/${gameId}/players/${playerId}/inventory`,
    );

    //clear inventory
    if (!data) {
      await inventoryRef.remove();
      return NextResponse.json({ data: "Success" });
    }

    const validatedData = updateInventorySchemaJSON.parse(
      JSON.parse(data),
    );

    await inventoryRef.set(validatedData);

    return NextResponse.json({ data: "Success" });
  } catch (error) {
    deleteSession();
    console.error(error);
    return NextResponse.json({ error: `${error}` });
  }
}
