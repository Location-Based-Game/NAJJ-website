import { getSessionData } from "../lib/sessionUtils";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { moveInventoryItemToGrid } from "../firebase-actions/moveInventoryItemToGrid";
import validateBody from "../lib/validateBody";
import { Inventory } from "../../../types";
import { currentItemsSchema } from "../../../schemas/currentItemsSchema";

export const setInventory = onAuthorizedRequest(async (request, response) => {
  const validatedData = validateBody(request.body, currentItemsSchema);

  const { currentItems } = validatedData;
  const { gameId, playerId } = await getSessionData(request);

  await moveInventoryItemToGrid(gameId, playerId, currentItems as Inventory);

  response.send({ data: "Success" });
});
