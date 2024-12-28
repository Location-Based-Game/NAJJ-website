import { getSessionData } from "../lib/sessionUtils";
import { Inventory } from "../types";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { currentItemsSchema } from "../schemas/currentItemsSchema";
import { moveInventoryItemToGrid } from "../firebase-actions/moveInventoryItemToGrid";

export const setInventory = onAuthorizedRequest(async (request, response) => {
  const validatedData = currentItemsSchema.safeParse(JSON.parse(request.body));
  if (!validatedData.success) {
    response.send({ error: "Invalid Data!" });
    return;
  }

  const { currentItems } = validatedData.data;
  const { gameId, playerId } = await getSessionData(request);

  await moveInventoryItemToGrid(gameId, playerId, currentItems as Inventory);

  response.send({ data: "Success" });
});
