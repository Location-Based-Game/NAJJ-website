import { RootState } from "@/store/store";
import {
  child,
  onChildAdded,
  onChildRemoved,
  ref,
  Unsubscribe,
} from "firebase/database";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { rtdb } from "../firebaseConfig";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { Item, itemSchema } from "@schemas/itemSchema";

/**
 * Listens for inventory/grid updates in the rtdb and spawns/deletes items
 */
export default function useSpawnItems() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { callUnityFunction, splashScreenComplete } = useUnityReactContext();

  const allInventoriesRef = useRef<Record<string, Unsubscribe[]>>({});
  useEffect(() => {
    if (!gameId) return;
    if (!splashScreenComplete) return;

    // Listen for new player inventories being added
    const inventoriesRef = ref(rtdb, `activeGames/${gameId}/inventories`);
    const inventoryAddedListener = onChildAdded(
      inventoriesRef,
      (newInventory) => {
        if (newInventory.key === null) return;

        // Add listeners for items on player inventory
        const playerInventoryRef = child(inventoriesRef, newInventory.key);
        allInventoriesRef.current[newInventory.key] = [
          onChildAdded(playerInventoryRef, (newItem) => {
            if (newItem.key === null) return;
            const data = itemSchema.parse(newItem.val()) as Item<any>;
            spawnItem(data);
          }),

          onChildRemoved(playerInventoryRef, (removedItem) => {
            if (removedItem.key === null) return;
            const data = itemSchema.parse(removedItem.val()) as Item<any>;
            if (data.isDestroyed) {
              callUnityFunction("DestroyItem", data.itemId)
            }
          }),
        ];
      },
    );

    const inventoryDeletedListener = onChildRemoved(
      inventoriesRef,
      (removedInventory) => {
        if (removedInventory.key === null) return;
        // Unsubscribe listener on player inventory
        allInventoriesRef.current[removedInventory.key].forEach((unsubscribe) =>
          unsubscribe(),
        );
      },
    );

    const gridRef = ref(rtdb, `activeGames/${gameId}/grid`);
    const gridItemAddedListener = onChildAdded(gridRef, (newItem) => {
      if (newItem.key === null) return;
      const data = newItem.val();
      const validatedData = itemSchema.parse(data);
      spawnItem(validatedData as Item<any>);
    });

    const gridItemRemovedListener = onChildRemoved(gridRef, (removedItem) => {
      if (removedItem.key === null) return;
      const data = removedItem.val();
      const validatedData = itemSchema.parse(data);
      if (validatedData.isDestroyed) {
        callUnityFunction("DestroyItem", validatedData.itemId)
      }
    });

    return () => {
      inventoryAddedListener();
      inventoryDeletedListener();
      gridItemAddedListener();
      gridItemRemovedListener();
      Object.values(allInventoriesRef.current).forEach((inventoryListeners) => {
        inventoryListeners.forEach((unsubscribe) => unsubscribe());
      });
      allInventoriesRef.current = {};
    };
  }, [gameId, splashScreenComplete]);

  function spawnItem(item: Item<any>) {
    // Timeout ensures items are spawned after players are instantiated
    setTimeout(() => {
      callUnityFunction("SpawnItem", {
        ...item,
        itemData:
          typeof item.itemData === "string"
            ? item.itemData
            : JSON.stringify(item.itemData),
      });
    }, 100);
  }
}
