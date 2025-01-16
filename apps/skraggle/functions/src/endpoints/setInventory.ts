import { getSessionData } from "../lib/sessionUtils";
import { Inventory } from "../types";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { currentItemsSchema } from "../schemas/currentItemsSchema";
import { moveInventoryItemToGrid } from "../firebase-actions/moveInventoryItemToGrid";
import validateBody from "../lib/validateBody";

export const setInventory = onAuthorizedRequest(async (request, response) => {
  const validatedData = validateBody<typeof currentItemsSchema>(
    request.body,
    currentItemsSchema,
  );

  const { currentItems } = validatedData;
  const { gameId, playerId } = await getSessionData(request);

  await moveInventoryItemToGrid(gameId, playerId, currentItems as Inventory);

  response.send({ data: "Success" });
});
