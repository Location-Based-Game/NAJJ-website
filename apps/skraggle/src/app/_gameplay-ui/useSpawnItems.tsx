import { RootState } from "@/store/store";
import { onChildAdded, onChildChanged, ref } from "firebase/database";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { rtdb } from "../firebaseConfig";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { Inventory } from "@types";
import { itemSchema } from "@schemas/itemSchema";

/**
 * Listens for inventory updates in the rtdb and spawns/deletes items in the player inventories.
 * TODO delete items
 */
export default function useSpawnItems() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const { callUnityFunction } = useUnityReactContext();

  useEffect(() => {
    if (!gameId) return;
    const inventoriesRef = ref(rtdb, `activeGames/${gameId}/inventories`);
    const inventoryAddedListener = onChildAdded(
      inventoriesRef,
      (newInventory) => {
        if (newInventory.key === null) return;
        const data = newInventory.val() as Inventory;
        SpawnItems(data);
      },
    );

    const inventoryChangedListener = onChildChanged(
      inventoriesRef,
      (newInventory) => {
        if (newInventory.key === null) return;
        const data = newInventory.val() as Inventory;
        SpawnItems(data);
      },
    );

    return () => {
      inventoryAddedListener();
      inventoryChangedListener();
    };
  }, [gameId, isGameActive]);

  function SpawnItems(inventory: Inventory) {
    setTimeout(() => {
      Object.values(inventory).forEach((values) => {
        const validatedData = itemSchema.parse(values);
        callUnityFunction("SpawnItem", {
          ...validatedData,
          itemData:
            typeof validatedData.itemData === "string"
              ? validatedData.itemData
              : JSON.stringify(validatedData.itemData),
        });
      });
    }, 100);
  }
}
